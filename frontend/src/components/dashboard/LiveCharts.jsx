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
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const makeOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0 // Disable animation for real-time performance
    },
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: title,
            color: '#e2e8f0',
            font: { size: 13, weight: 600 },
            padding: { bottom: 8 }
        },
    },
    scales: {
        x: {
            grid: { color: 'rgba(148, 163, 184, 0.08)' },
            ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 8 }
        },
        y: {
            grid: { color: 'rgba(148, 163, 184, 0.08)' },
            ticks: { color: '#64748b', font: { size: 10 } }
        }
    }
});

const chartConfigs = [
    { key: 'voltage', label: 'Voltage (V)', color: '#3b82f6' },
    { key: 'current', label: 'Current (A)', color: '#10b981' },
    { key: 'power', label: 'Power (W)', color: '#f59e0b' },
    { key: 'temperature', label: 'Temperature (°C)', color: '#ef4444' },
    { key: 'power_factor', label: 'Power Factor', color: '#8b5cf6' },
    { key: 'vibration', label: 'Vibration (mm/s)', color: '#ec4899' },
    { key: 'slip', label: 'Slip (%)', color: '#14b8a6' },
    { key: 'speed', label: 'Speed (RPM)', color: '#f97316' },
];

const LiveCharts = ({ dataHistory }) => {
    const labels = dataHistory.map(d => new Date(d.timestamp).toLocaleTimeString());

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {chartConfigs.map(({ key, label, color }) => {
                const data = {
                    labels,
                    datasets: [
                        {
                            label,
                            data: dataHistory.map(d => d[key]),
                            borderColor: color,
                            backgroundColor: color + '20',
                            tension: 0.4,
                            pointRadius: 2,
                            pointHoverRadius: 5,
                            borderWidth: 2,
                            fill: true,
                        }
                    ],
                };

                return (
                    <div key={key} className="glass-panel" style={{ padding: '1rem', height: '250px' }}>
                        <Line options={makeOptions(label)} data={data} />
                    </div>
                );
            })}
        </div>
    );
};

export default LiveCharts;
