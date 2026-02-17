import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0 // Disable animation for real-time performance
    },
    plugins: {
        legend: {
            position: 'top',
            labels: { color: '#94a3b8' }
        },
        title: {
            display: false,
        },
    },
    scales: {
        x: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8' }
        },
        y: {
            grid: { color: 'rgba(148, 163, 184, 0.1)' },
            ticks: { color: '#94a3b8' }
        }
    }
};

const LiveCharts = ({ dataHistory }) => {
    const labels = dataHistory.map(d => new Date(d.timestamp).toLocaleTimeString());

    const voltageData = {
        labels,
        datasets: [
            {
                label: 'Voltage (V)',
                data: dataHistory.map(d => d.voltage),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4
            }
        ],
    };

    const currentData = {
        labels,
        datasets: [
            {
                label: 'Current (A)',
                data: dataHistory.map(d => d.current),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.4
            }
        ],
    };

    const tempData = {
        labels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: dataHistory.map(d => d.temperature),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                tension: 0.4
            }
        ],
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1rem', height: '300px' }}>
                <Line options={options} data={voltageData} />
            </div>
            <div className="glass-panel" style={{ padding: '1rem', height: '300px' }}>
                <Line options={options} data={currentData} />
            </div>
            <div className="glass-panel" style={{ padding: '1rem', height: '300px' }}>
                <Line options={options} data={tempData} />
            </div>
        </div>
    );
};

export default LiveCharts;
