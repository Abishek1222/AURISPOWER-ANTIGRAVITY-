import React from 'react';
import { Leaf, Zap, BarChart3 } from 'lucide-react';

const SustainabilityCard = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Leaf color="var(--success)" size={24} />
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Sustainability Metrics</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Zap size={16} color="var(--warning)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Energy Usage</span>
                    </div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{metrics.energy_kwh} <span style={{ fontSize: '0.8rem' }}>kWh</span></p>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <BarChart3 size={16} color="var(--text-secondary)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Carbon Footprint</span>
                    </div>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{metrics.co2_kg} <span style={{ fontSize: '0.8rem' }}>kgCO2e</span></p>
                </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Efficiency Score</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: metrics.efficiency_score > 90 ? 'var(--success)' : 'var(--warning)' }}>{metrics.efficiency_score}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${metrics.efficiency_score}%`,
                        height: '100%',
                        background: metrics.efficiency_score > 90 ? 'var(--success)' : 'var(--warning)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default SustainabilityCard;
