import React from 'react';

const RiskMeter = ({ riskScore, status }) => {
    // Determine color based on status or risk score
    let color = 'var(--success)';
    if (status === 'Overload' || riskScore > 80) color = 'var(--danger)';
    else if (status !== 'Normal' || riskScore > 50) color = 'var(--warning)';

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <h3 style={{ margin: '0 0 1rem', color: 'var(--text-secondary)' }}>System Risk</h3>

            <div style={{
                position: 'relative',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `conic-gradient(${color} ${riskScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${color}40`,
                transition: 'all 0.5s ease'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{riskScore}%</span>
                    <span style={{ fontSize: '0.8rem', color: color, fontWeight: 600 }}>{status}</span>
                </div>
            </div>

            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Current Status: <strong style={{ color: color }}>{status}</strong>
            </p>
        </div>
    );
};

export default RiskMeter;
