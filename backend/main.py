from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from simulator.engine import ElectricalDataSimulator
from simulator.fault_injector import FaultInjector
from auth import router as auth_router
from ml.anomaly_detector import AnomalyDetector
from ml.genai_explainer import GenAIExplainer
from ml.sustainability import SustainabilityEngine

app = FastAPI()

app.include_router(auth_router.router, prefix="/auth", tags=["auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Use MultiZoneEngine instead of single simulator
multi_zone_engine = MultiZoneEngine()
anomaly_detector = AnomalyDetector()
genai_explainer = GenAIExplainer()
sustainability_engine = SustainabilityEngine()
notification_service = NotificationService()

@app.get("/")
def read_root():
    return {"message": "Aurispower Backend Online (Multi-Zone Active)"}

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
            # Get readings for ALL zones
            readings = multi_zone_engine.get_all_readings()
            
            processed_readings = []
            for data in readings:
                # ML Analysis
                is_anomaly = anomaly_detector.predict(data)
                explanation = genai_explainer.explain(data, is_anomaly, data['status'])
                
                # Sustainability Analysis
                sust_metrics = sustainability_engine.calculate_impact(data['power'], data['timestamp'])

                # Notification Logic
                if data['status'] == 'Overload':
                    notification_service.send_alert("critical", "Overload detected! Immediate check required.", data['zone_name'])

                data['anomaly_score'] = int(is_anomaly)
                data['analysis'] = explanation
                data['sustainability'] = sust_metrics
                processed_readings.append(data)

            await websocket.send_json(processed_readings)
            await asyncio.sleep(1) # Simulate 1 second data interval
    except WebSocketDisconnect:
        print("Frontend disconnected")
