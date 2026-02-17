import React, { useState, useEffect, useRef } from 'react';
import { Globe, Server, Fan, Factory } from 'lucide-react';
import api from '../services/api';

const GlobalOverview = () => {
    const [zonesData, setZonesData] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws');
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Backend now sends an array of zone data
            if (Array.isArray(data)) {
                setZonesData(data);
            }
        };

        return () => {
            if (ws.readyState === 1) ws.close();
        };
    }, []);

    const getIcon = (name) => {
        if (name.includes("Manufacturing")) return <Factory size={32} />;
        if (name.includes("Server")) return <Server size={32} />;
        if (name.includes("HVAC")) return <Fan size={32} />;
        return <Globe size={32} />;
    };

    const getStatusColor = (status) => {
        if (status === 'Overload') return 'var(--danger)';
        if (status === 'Loose Connection') return 'var(--warning)';
        return 'var(--success)';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={28} color="var(--accent-color)" />
                Global Operations Overview
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {zonesData.map((zone) => (
                    <div key={zone.zone_id} className="glass-panel" style={{ padding: '1.5rem', borderTop: `4px solid ${getStatusColor(zone.status)}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '12px' }}>
                                {getIcon(zone.zone_name)}
                            </div>
                            <span style={{
                                background: getStatusColor(zone.status),
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                color: '#fff'
                            }}>
                                {zone.status}
                            </span>
                        </div>

                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{zone.zone_name}</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ID: {zone.zone_id}</p>

                        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Power Load</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{zone.power} W</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Efficiency</p>
                                <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{zone.sustainability?.efficiency_score}%</p>
                            </div>
                        </div>
                    </div>
                ))}

                {zonesData.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        Connecting to Global Satellite Network...
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalOverview;
