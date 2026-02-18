import React, { useState, useEffect, useRef } from 'react';
import LiveCharts from './LiveCharts';
import RiskMeter from './RiskMeter';
import AlertFeed from './AlertFeed';
import SustainabilityCard from './SustainabilityCard';
import api from '../../services/api';

const DATASET_FAULT_TYPES = [
    "Undervoltage", "Overvoltage", "Voltage Unbalance", "Voltage Unbalance with Rotor Fault",
    "Overcurrent", "Single Phasing",
    "Stator Winding Fault", "Stator Overheating",
    "Rotor Bar Fault", "Rotor Imbalance",
    "Insulation Breakdown", "Insulation Breakdown with Ground Leakage",
    "Bearing Inner Race Fault", "Bearing Outer Race Fault", "Bearing Fault with Speed Drop", "Bearing Overheating",
    "Mechanical Overload", "Overload with Overheating", "Shaft Misalignment",
    "Cooling Failure", "Electrical and Mechanical Combined Failure", "Catastrophic System Failure",
];

const Dashboard = () => {
    const [dataHistory, setDataHistory] = useState([]);
    const [currentData, setCurrentData] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [selectedFault, setSelectedFault] = useState(DATASET_FAULT_TYPES[0]);
    const wsRef = useRef(null);

    useEffect(() => {
        // Initialize WebSocket
        const ws = new WebSocket('ws://localhost:8000/ws');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket Connected");
        };

        ws.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            // Handle Multi-Zone data (Array) vs Single Zone (Object)
            // For the main dashboard, we'll default to showing Zone 1 (Manufacturing)
            const data = Array.isArray(parsedData) ? parsedData[0] : parsedData;

            setCurrentData(data);

            // Update history (keep last 20 points for charts)
            setDataHistory(prev => {
                const newHistory = [...prev, data];
                if (newHistory.length > 20) return newHistory.slice(newHistory.length - 20);
                return newHistory;
            });

            // Generate alerts based on dataset fault type
            if (data.status !== 'Normal Operation') {
                const newAlert = {
                    title: `${data.status}`,
                    message: data.analysis?.message || "Fault Detected",
                    type: data.analysis?.type === 'critical' ? 'critical' : 'warning',
                    timestamp: new Date().toISOString()
                };

                setAlerts(prev => {
                    if (prev.length > 0 && prev[0].title === newAlert.title && (new Date() - new Date(prev[0].timestamp) < 5000)) return prev;
                    return [newAlert, ...prev].slice(0, 10);
                });
            }
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        return () => {
            if (ws.readyState === 1) ws.close();
        };
    }, []);

    const handleInjectFault = async (faultType) => {
        try {
            // Defaulting to zone_1 for the main dashboard simulation
            await api.post(`/inject-fault/zone_1/${faultType}`);
        } catch (error) {
            console.error("Failed to inject fault", error);
        }
    };

    const handleClearFault = async () => {
        try {
            await api.post('/clear-fault/zone_1');
        } catch (error) {
            console.error("Failed to clear fault", error);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1rem', height: 'calc(100vh - 4rem)', overflow: 'hidden' }}>
            {/* Main Chart Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h2 style={{ margin: 0 }}>Real-Time Monitor</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select
                            value={selectedFault}
                            onChange={(e) => setSelectedFault(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                padding: '0.4rem 0.6rem',
                                color: 'var(--text-primary)',
                                fontSize: '0.75rem',
                                outline: 'none',
                                maxWidth: '220px',
                            }}
                        >
                            {DATASET_FAULT_TYPES.map(f => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                        <button onClick={() => handleInjectFault(selectedFault)} className="btn-primary" style={{ background: 'var(--danger)', fontSize: '0.75rem', padding: '0.4rem 0.75rem', whiteSpace: 'nowrap' }}>Inject Fault</button>
                        <button onClick={handleClearFault} className="btn-primary" style={{ background: 'var(--success)', fontSize: '0.75rem', padding: '0.4rem 0.75rem', whiteSpace: 'nowrap' }}>Clear Override</button>
                    </div>
                </div>

                <LiveCharts dataHistory={dataHistory} />

                <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem' }}>
                    <h3>Latest Reading</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Voltage</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.voltage || '--'} V</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.current || '--'} A</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Power</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.power || '--'} kW</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Temperature</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.temperature || '--'} °C</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Power Factor</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.power_factor || '--'}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vibration</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.vibration || '--'} mm/s</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Slip</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.slip || '--'} %</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Speed</p>
                            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{currentData?.speed || '--'} RPM</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                <RiskMeter
                    status={currentData?.status || 'Normal Operation'}
                    riskScore={currentData?.analysis?.risk_score ?? 10}
                />
                <SustainabilityCard metrics={currentData?.sustainability} />
                <AlertFeed alerts={alerts} />
            </div>
        </div>
    );
};

export default Dashboard;
