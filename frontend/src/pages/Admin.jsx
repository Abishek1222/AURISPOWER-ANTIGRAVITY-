import React, { useState } from 'react';
import { User, Server, Shield, Trash2, UserPlus } from 'lucide-react';

const Admin = () => {
    // Mock User Data
    const [users, setUsers] = useState([
        { id: 1, username: 'admin', role: 'owner', status: 'Active' },
        { id: 2, username: 'manager1', role: 'manager', status: 'Active' },
        { id: 3, username: 'tech_lead', role: 'electrician', status: 'Offline' },
    ]);

    const handleDelete = (id) => {
        setUsers(users.filter(u => u.id !== id));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={28} color="var(--accent-color)" />
                Administration Panel
            </h2>

            {/* System Health Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>System Uptime</span>
                        <Server size={20} color="var(--success)" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>99.9%</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--success)' }}>Running smoothly</p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Active Users</span>
                        <User size={20} color="var(--info)" />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>3</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Currently logged in</p>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Database Status</span>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Connected</h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Latency: 12ms</p>
                </div>
            </div>

            {/* User Management Section */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>User Management</h3>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserPlus size={16} /> Add User
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Username</th>
                            <th style={thStyle}>Role</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={tdStyle}>#{user.id}</td>
                                <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</td>
                                <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{user.role}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        color: user.status === 'Active' ? 'var(--success)' : 'var(--text-secondary)',
                                        background: user.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const thStyle = {
    textAlign: 'left',
    padding: '1rem',
    color: 'var(--text-secondary)',
    fontWeight: 600
};

const tdStyle = {
    padding: '1rem',
    color: 'var(--text-secondary)'
};

export default Admin;
