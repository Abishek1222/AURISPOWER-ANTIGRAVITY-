from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from auth import router as auth_router
from ml.anomaly_detector import AnomalyDetector
from ml.genai_explainer import GenAIExplainer
from ml.sustainability import SustainabilityEngine
from services.notification import NotificationService
from services.dataset_manager import DatasetManager
from simulator.multi_zone import MultiZoneEngine

app = FastAPI()

app.include_router(auth_router.router, prefix="/auth", tags=["auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core engines
multi_zone_engine = MultiZoneEngine()
anomaly_detector = AnomalyDetector()
genai_explainer = GenAIExplainer()
sustainability_engine = SustainabilityEngine()
notification_service = NotificationService()
dataset_manager = DatasetManager()

# Track active WebSocket connections
active_ws_connections = 0

@app.get("/")
def read_root():
    return {"message": "Aurispower Backend Online (Dataset Replay Active)"}

@app.get("/notifications")
def get_notifications():
    return notification_service.get_history()

@app.get("/notifications/stats")
def get_notification_stats():
    return notification_service.get_stats()

# --- Dataset Management ---

@app.get("/dataset-info")
def get_dataset_info():
    """Returns metadata about the currently active dataset."""
    return dataset_manager.get_info()

@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a new dataset (.xlsx or .csv).
    Validates columns, saves to Datasets/, and hot-swaps the engine.
    """
    contents = await file.read()
    try:
        info = dataset_manager.validate_and_save(contents, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Hot-swap the running engine to use the new dataset
    multi_zone_engine.reload_dataset(dataset_manager.get_current_path())

    return {"status": "Dataset uploaded and activated", "dataset": info}

@app.post("/reset-dataset")
def reset_dataset():
    """Reset to the default industrial dataset."""
    info = dataset_manager.reset()
    multi_zone_engine.reload_dataset(dataset_manager.get_current_path())
    return {"status": "Reset to default dataset", "dataset": info}

@app.get("/live-status")
def get_live_status():
    """Returns current streaming status."""
    return {
        "active_connections": active_ws_connections,
        "streaming": active_ws_connections > 0,
        "dataset": dataset_manager.current_file,
    }

# --- Fault Injection ---

@app.post("/inject-fault/{zone_id}/{fault_type}")
def inject_fault(zone_id: str, fault_type: str):
    zone = multi_zone_engine.get_zone(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    zone.fault_injector.set_fault(fault_type)
    return {"status": "Fault Injected", "zone": zone.zone_name, "fault": fault_type}

@app.post("/clear-fault/{zone_id}")
def clear_fault(zone_id: str):
    zone = multi_zone_engine.get_zone(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    
    zone.fault_injector.clear_fault()
    return {"status": "Fault Cleared", "zone": zone.zone_name}

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Chat with the AI Assistant (Gemini).
    Injects real-time system context into the prompt.
    """
    # Gather context from engines
    readings = multi_zone_engine.get_all_readings()
    system_status = "Active System Readings:\n"
    for r in readings:
        system_status += f"- Zone: {r.get('zone_name', 'Unknown')}\n"
        system_status += f"  Status: {r['status']}\n"
        system_status += f"  Parameters: Voltage={r['voltage']}V, Current={r['current']}A, Power={r['power']}kW, Temp={r['temperature']}C\n"
    
    # Get alerts
    alerts = notification_service.get_history()
    if alerts:
        system_status += "\nRecent Alerts (Last 5):\n"
        for a in alerts[:5]:
             system_status += f"- [{a['timestamp']}] {a['severity'].upper()}: {a['message']} ({a['zone']})\n"
    else:
        system_status += "\nNo active alerts in history.\n"

    response = await genai_explainer.chat_with_context(request.message, system_status)
    return {"reply": response}

# --- WebSocket ---

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global active_ws_connections
    await websocket.accept()
    active_ws_connections += 1
    try:
        while True:
            readings = multi_zone_engine.get_all_readings()
            
            processed_readings = []
            for data in readings:
                # ML Analysis
                is_anomaly = anomaly_detector.predict(data)
                explanation = genai_explainer.explain(data, is_anomaly, data['status'])
                
                # Sustainability Analysis — pass power_factor from dataset
                sust_metrics = sustainability_engine.calculate_impact(
                    data['power'], data['timestamp'], data.get('power_factor')
                )

                # Notification Logic — severity derived from the explainer's output
                if data['status'] not in ('Normal Operation', '-'):
                    severity = "critical" if explanation.get("type") == "critical" else "warning"
                    notification_service.send_alert(severity, f"{data['status']} detected", data.get('zone_name', 'Unknown'))

                data['anomaly_score'] = int(is_anomaly)
                data['analysis'] = explanation
                data['sustainability'] = sust_metrics
                processed_readings.append(data)

            await websocket.send_json(processed_readings)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        active_ws_connections -= 1
        print("Frontend disconnected")
