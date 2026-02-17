import React from 'react';
import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

const IndustryStandards = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BookOpen size={28} color="var(--accent-color)" />
                Industry 4.0 & 5.0 Compliance
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Industry 4.0 Section */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(59, 130, 246, 0.3)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        Industry 4.0 <span style={{ fontSize: '0.8rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#3b82f6' }}>Automation & Data</span>
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        <ListItem title="Digital Twin" desc="Real-time simulation of physical assets (Zone Simulation)." />
                        <ListItem title="Interconnectivity" desc="IoT-ready WebSocket streaming and API integrations." />
                        <ListItem title="Predictive Maintenance" desc="ML-driven anomaly detection (Isolation Forest)." />
                        <ListItem title="Real-Time Data" desc="Millisecond-latency monitoring of electrical parameters." />
                    </ul>
                </div>

                {/* Industry 5.0 Section */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.3)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        Industry 5.0 <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#10b981' }}>Human-Centric & Sustainable</span>
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        <ListItem title="Human-Centric AI" desc="GenAI explanations enabling operators to understand complex faults." />
                        <ListItem title="Sustainability" desc="Real-time Carbon Footprint & Energy Efficiency tracking." />
                        <ListItem title="Resilience" desc="Fault Injection Engine to stress-test system and train operators." />
                        <ListItem title="Cognitive Computing" desc="Adaptive risk scoring and automated reasoning." />
                    </ul>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3>Why Aurispower?</h3>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
                    Aurispower bridges the gap between purely automated systems (4.0) and human-empowered sustainable operations (5.0), providing a comprehensive solution for modern enterprise electrical management.
                </p>
            </div>
        </div>
    );
};

const ListItem = ({ title, desc }) => (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <CheckCircle size={18} color="var(--success)" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
        <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>{title}</strong>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{desc}</span>
        </div>
    </li>
);

export default IndustryStandards;
