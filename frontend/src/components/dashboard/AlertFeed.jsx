import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

const AlertFeed = ({ alerts }) => {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', height: '100%', maxHeight: '400px', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 1rem', color: 'var(--text-secondary)' }}>Live Insights</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {alerts.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No active alerts.</p>
                ) : (
                    alerts.map((alert, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderLeft: `4px solid ${alert.type === 'critical' ? 'var(--danger)' : alert.type === 'warning' ? 'var(--warning)' : 'var(--success)'}`
                        }}>
                            <div style={{ marginTop: '2px' }}>
                                {alert.type === 'critical' && <AlertTriangle size={16} color="var(--danger)" />}
                                {alert.type === 'warning' && <AlertTriangle size={16} color="var(--warning)" />}
                                {alert.type === 'info' && <Info size={16} color="var(--accent-color)" />}
                                {alert.type === 'success' && <CheckCircle size={16} color="var(--success)" />}
                            </div>
                            <div>
                                <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.9rem' }}>{alert.title}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alert.message}</p>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: '0.25rem' }}>
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertFeed;
