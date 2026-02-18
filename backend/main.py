from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from auth import router as auth_router
from ml.anomaly_detector import AnomalyDetector
from ml.genai_explainer import GenAIExplainer
from ml.sustainability import SustainabilityEngine
from services.notification import NotificationService
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

@app.get("/")
def read_root():
    return {"message": "Aurispower Backend Online (Dataset Replay Active)"}

@app.get("/notifications")
def get_notifications():
    return notification_service.get_history()

@app.get("/notifications/stats")
def get_notification_stats():
    return notification_service.get_stats()

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

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            readings = multi_zone_engine.get_all_readings()
            
            processed_readings = []
            for data in readings:
                # ML Analysis
                is_anomaly = anomaly_detector.predict(data)
                explanation = genai_explainer.explain(data, is_anomaly, data['status'])
                
                # Sustainability Analysis
                sust_metrics = sustainability_engine.calculate_impact(data['power'], data['timestamp'])

                # Notification Logic for critical faults
                if data['status'] not in ('Normal Operation', '-'):
                    severity = "critical" if explanation.get("risk_score", 0) >= 85 else "warning"
                    notification_service.send_alert(severity, f"{data['status']} detected", data.get('zone_name', 'Unknown'))

                data['anomaly_score'] = int(is_anomaly)
                data['analysis'] = explanation
                data['sustainability'] = sust_metrics
                processed_readings.append(data)

            await websocket.send_json(processed_readings)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("Frontend disconnected")
