import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Filter, CheckCircle, AlertTriangle, AlertOctagon, Bell, Mail, RefreshCw } from 'lucide-react';
import api from '../services/api';

const Alerts = () => {
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({ total: 0, critical: 0, warning: 0, by_zone: {} });
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const [notifRes, statsRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/stats')
            ]);
            setNotifications(notifRes.data);
            setStats(statsRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        intervalRef.current = setInterval(fetchNotifications, 3000); // Poll every 3s
        return () => clearInterval(intervalRef.current);
    }, []);

    const filteredNotifications = notifications.filter(n => {
        if (filter !== 'all' && n.severity !== filter) return false;
        if (searchTerm && !n.message.toLowerCase().includes(searchTerm.toLowerCase()) && !n.zone.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    const getIcon = (severity) => {
        switch (severity) {
            case 'critical': return <AlertOctagon color="var(--danger)" size={18} />;
            case 'warning': return <AlertTriangle color="var(--warning)" size={18} />;
            default: return <CheckCircle color="var(--success)" size={18} />;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="glass-panel" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={24} color="var(--accent-color)" />
                    </div>
                    <h2 style={{ margin: 0 }}>Notification Log</h2>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            fontSize: '0.85rem',
                            width: '200px',
                        }}
                    />
                    <div className="glass-panel" style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '8px' }}>
                        <Filter size={16} color="var(--text-secondary)" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                        >
                            <option value="all">All</option>
                            <option value="critical">Critical</option>
                            <option value="warning">Warning</option>
                        </select>
                    </div>
                    <button onClick={fetchNotifications} className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>Total Sent</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--accent-color)' }}>{stats.total}</p>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>Critical Alerts</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--danger)' }}>{stats.critical}</p>
                </div>
                <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>Warnings</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--warning)' }}>{stats.warning}</p>
                </div>
                {Object.entries(stats.by_zone || {}).map(([zone, count]) => (
                    <div key={zone} className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>{zone}</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{count}</p>
                    </div>
                ))}
            </div>

            {/* Notification Table */}
            <div className="glass-panel" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(4px)', zIndex: 10 }}>
                            <tr>
                                <th style={thStyle}>Severity</th>
                                <th style={thStyle}>Time</th>
                                <th style={thStyle}>Zone</th>
                                <th style={thStyle}>Message</th>
                                <th style={thStyle}>Channel</th>
                                <th style={thStyle}>Recipients</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNotifications.map((n) => (
                                <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: n.severity === 'critical' ? 'rgba(239, 68, 68, 0.04)' : 'transparent' }}>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {getIcon(n.severity)}
                                            <span style={{
                                                textTransform: 'uppercase',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                background: n.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                                color: n.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'
                                            }}>
                                                {n.severity}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={tdStyle}>{new Date(n.timestamp).toLocaleString()}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-primary)', fontWeight: 500 }}>{n.zone}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-primary)' }}>{n.message}</td>
                                    <td style={tdStyle}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <Mail size={14} color="var(--text-secondary)" />
                                            <span>{n.channel}</span>
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, fontSize: '0.8rem' }}>{n.recipients?.join(', ')}</td>
                                </tr>
                            ))}
                            {!loading && filteredNotifications.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        {notifications.length === 0 ? 'No notifications yet — waiting for fault data...' : 'No notifications match your filter.'}
                                    </td>
                                </tr>
                            )}
                            {loading && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading notifications...</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const thStyle = {
    padding: '0.75rem',
    textAlign: 'left',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.8rem',
};

const tdStyle = {
    padding: '0.6rem 0.75rem',
    color: 'var(--text-secondary)',
};

export default Alerts;
