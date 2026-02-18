import React, { useState, useEffect, useRef } from 'react';
import { Download, Pause, Play, Activity } from 'lucide-react';

const Monitor = () => {
    const [history, setHistory] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws');
        wsRef.current = ws;

        ws.onmessage = (event) => {
            if (isPaused) return;
            const parsedData = JSON.parse(event.data);
            // Handle Multi-Zone data (Array) vs Single Zone (Object)
            const data = Array.isArray(parsedData) ? parsedData[0] : parsedData;
            setHistory(prev => [data, ...prev].slice(0, 100)); // Keep last 100 records
        };

        return () => {
            if (ws.readyState === 1) ws.close();
        };
    }, [isPaused]);

    const handleExport = () => {
        const headers = ["Timestamp", "Voltage (V)", "Current (A)", "Power (W)", "Power Factor", "Temp (C)", "Frequency (Hz)", "Vibration (mm/s)", "Slip (%)", "Speed (RPM)", "Status"];
        const csvContent = [
            headers.join(","),
            ...history.map(row => [
                row.timestamp,
                row.voltage,
                row.current,
                row.power,
                row.power_factor,
                row.temperature,
                row.frequency,
                row.vibration,
                row.slip,
                row.speed,
                row.status
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aurispower_monitor_${new Date().toISOString()}.csv`;
        a.click();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={24} color="var(--accent-color)" />
                    </div>
                    <h2 style={{ margin: 0 }}>Live Data Monitor</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="btn-primary"
                        style={{ background: isPaused ? 'var(--success)' : 'var(--warning)' }}
                    >
                        {isPaused ? <><Play size={16} /> Resume</> : <><Pause size={16} /> Pause</>}
                    </button>
                    <button onClick={handleExport} className="btn-primary">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflowY: 'auto', overflowX: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                            <tr>
                                <th style={thStyle}>Timestamp</th>
                                <th style={thStyle}>Voltage (V)</th>
                                <th style={thStyle}>Current (A)</th>
                                <th style={thStyle}>Power (kW)</th>
                                <th style={thStyle}>PF</th>
                                <th style={thStyle}>Temp (°C)</th>
                                <th style={thStyle}>Freq (Hz)</th>
                                <th style={thStyle}>Vibration (mm/s)</th>
                                <th style={thStyle}>Slip (%)</th>
                                <th style={thStyle}>Speed (RPM)</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((row, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                                    <td style={tdStyle}>{new Date(row.timestamp).toLocaleTimeString()}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-primary)' }}>{row.voltage?.toFixed(1)}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-primary)' }}>{row.current?.toFixed(1)}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-primary)' }}>{row.power?.toFixed(0)}</td>
                                    <td style={{ ...tdStyle, color: row.power_factor < 0.8 ? 'var(--danger)' : 'var(--text-primary)' }}>{row.power_factor?.toFixed(3)}</td>
                                    <td style={{ ...tdStyle, color: row.temperature > 75 ? 'var(--danger)' : 'var(--text-primary)' }}>{row.temperature?.toFixed(1)}</td>
                                    <td style={tdStyle}>{row.frequency?.toFixed(2)}</td>
                                    <td style={{ ...tdStyle, color: row.vibration > 5 ? 'var(--danger)' : 'var(--text-primary)' }}>{row.vibration?.toFixed(2)}</td>
                                    <td style={{ ...tdStyle, color: row.slip > 8 ? 'var(--danger)' : 'var(--text-primary)' }}>{row.slip?.toFixed(2)}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-primary)' }}>{row.speed?.toFixed(1)}</td>
                                    <td style={tdStyle}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            background: row.status === 'Normal' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                            color: row.status === 'Normal' ? 'var(--success)' : 'var(--danger)'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="11" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Waiting for data stream...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

const thStyle = {
    padding: '0.75rem 0.5rem',
    textAlign: 'left',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.8rem'
};

const tdStyle = {
    padding: '0.5rem',
    color: 'var(--text-secondary)'
};

export default Monitor;
