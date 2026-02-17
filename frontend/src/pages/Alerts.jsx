import React, { useState } from 'react';
import { ShieldAlert, Filter, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

// Mock Alert History (Since we don't have a relentless DB yet, we simulate history)
const MOCK_HISTORY = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    type: i % 5 === 0 ? 'critical' : i % 3 === 0 ? 'warning' : 'info',
    message: i % 5 === 0 ? 'Critical Overload detected in Sector 4' : i % 3 === 0 ? 'Voltage fluctuation observed' : 'System diagnostic check complete',
    status: 'Resolved'
}));

const Alerts = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAlerts = MOCK_HISTORY.filter(alert => {
        if (filter !== 'all' && alert.type !== filter) return false;
        if (searchTerm && !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'critical': return <AlertOctagon color="var(--danger)" size={20} />;
            case 'warning': return <AlertTriangle color="var(--warning)" size={20} />;
            default: return <CheckCircle color="var(--success)" size={20} />;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShieldAlert size={24} color="var(--accent-color)" />
                    </div>
                    <h2 style={{ margin: 0 }}>System Alerts & Logs</h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}>
                        <Filter size={16} color="var(--text-secondary)" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none' }}
                        >
                            <option value="all">All Severities</option>
                            <option value="critical">Critical</option>
                            <option value="warning">Warning</option>
                            <option value="info">Info</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                            <tr>
                                <th style={thStyle}>Severity</th>
                                <th style={thStyle}>Timestamp</th>
                                <th style={thStyle}>Message</th>
                                <th style={thStyle}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAlerts.map((alert) => (
                                <tr key={alert.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getIcon(alert.type)}
                                            <span style={{ textTransform: 'capitalize', color: 'var(--text-primary)' }}>{alert.type}</span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{new Date(alert.timestamp).toLocaleString()}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-primary)' }}>{alert.message}</td>
                                    <td style={tdStyle}>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                                            {alert.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const thStyle = {
    padding: '1rem',
    textAlign: 'left',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const tdStyle = {
    padding: '1rem',
    color: 'var(--text-secondary)'
};

export default Alerts;
