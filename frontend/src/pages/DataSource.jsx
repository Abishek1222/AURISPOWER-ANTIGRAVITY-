import React, { useState, useEffect, useRef } from 'react';
import { Database, Upload, FileSpreadsheet, Radio, CheckCircle, AlertTriangle, X, Eye, RotateCcw } from 'lucide-react';
import api from '../services/api';

const DataSource = () => {
    const [datasetInfo, setDatasetInfo] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const fetchInfo = async () => {
        try {
            const [infoRes, statusRes] = await Promise.all([
                api.get('/dataset-info'),
                api.get('/live-status'),
            ]);
            setDatasetInfo(infoRes.data);
            setLiveStatus(statusRes.data);
        } catch (err) {
            console.error('Failed to fetch dataset info', err);
        }
    };

    useEffect(() => {
        fetchInfo();
        const interval = setInterval(fetchInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleUpload = async (file) => {
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls', 'csv'].includes(ext)) {
            setError('Only .xlsx and .csv files are supported');
            return;
        }

        setUploading(true);
        setError(null);
        setUploadResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/upload-dataset', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadResult(res.data);
            setDatasetInfo(res.data.dataset);
        } catch (err) {
            setError(err.response?.data?.detail || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleReset = async () => {
        try {
            const res = await api.post('/reset-dataset');
            setDatasetInfo(res.data.dataset);
            setUploadResult({ dataset: res.data.dataset, status: 'Reset to default dataset' });
        } catch (err) {
            setError('Failed to reset dataset');
        }
    };

    const handleFileSelect = (e) => {
        handleUpload(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        handleUpload(e.dataTransfer.files[0]);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Database size={28} color="var(--accent-color)" />
                Data Source Management
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Live Status */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: liveStatus?.streaming ? 'var(--success)' : 'var(--text-secondary)',
                            boxShadow: liveStatus?.streaming ? '0 0 8px var(--success)' : 'none',
                            animation: liveStatus?.streaming ? 'pulse 2s infinite' : 'none',
                        }} />
                        <h3 style={{ margin: 0 }}>Live Data Status</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Status</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: liveStatus?.streaming ? 'var(--success)' : 'var(--warning)' }}>
                                {liveStatus?.streaming ? 'Streaming' : 'Idle'}
                            </p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Active Connections</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{liveStatus?.active_connections ?? 0}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Current Dataset</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 500, margin: 0, color: 'var(--accent-color)' }}>
                                <FileSpreadsheet size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                                {liveStatus?.dataset || '—'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dataset Info */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.25rem' }}>Dataset Overview</h3>
                    {datasetInfo ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Total Rows</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--accent-color)' }}>{datasetInfo.rows?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Fault Types</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{datasetInfo.fault_type_count}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Columns</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>{datasetInfo.columns?.length}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 0.25rem' }}>Last Upload</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>
                                    {datasetInfo.upload_time ? new Date(datasetInfo.upload_time).toLocaleString() : 'Default dataset'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
                    )}
                </div>
            </div>

            {/* Upload Area */}
            <div
                className="glass-panel"
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    border: dragActive ? '2px dashed var(--accent-color)' : '2px dashed rgba(255,255,255,0.15)',
                    background: dragActive ? 'rgba(59, 130, 246, 0.08)' : undefined,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                }}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />
                <Upload size={48} color={dragActive ? 'var(--accent-color)' : 'var(--text-secondary)'} style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem' }}>
                    {uploading ? 'Uploading...' : 'Upload New Dataset'}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Drag and drop an <strong>.xlsx</strong> or <strong>.csv</strong> file here, or click to browse
                </p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleReset(); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.5rem 1rem', borderRadius: '6px',
                            border: '1px solid var(--border-color)', background: 'transparent',
                            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem'
                        }}
                    >
                        <RotateCcw size={14} /> Reset to Default
                    </button>
                </div>
                <p style={{ margin: '1rem 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Required columns: Voltage (V), Current (A), Power (kW), Temperature (°C), Vibration (mm/s), Speed (RPM), Slip, Power Factor, Fault_Type
                </p>

                {uploading && (
                    <div style={{ marginTop: '1rem' }}>
                        <div style={{ width: '200px', height: '4px', background: 'var(--bg-secondary)', borderRadius: '2px', margin: '0 auto', overflow: 'hidden' }}>
                            <div style={{ width: '60%', height: '100%', background: 'var(--accent-color)', animation: 'pulse 1s infinite', borderRadius: '2px' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Upload Result */}
            {uploadResult && (
                <div className="glass-panel" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--success)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={20} color="var(--success)" />
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600 }}>Dataset uploaded and activated!</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            {uploadResult.dataset?.filename} — {uploadResult.dataset?.rows?.toLocaleString()} rows, {uploadResult.dataset?.fault_type_count} fault types
                        </p>
                    </div>
                    <button onClick={() => setUploadResult(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="glass-panel" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertTriangle size={20} color="var(--danger)" />
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--danger)' }}>Upload Failed</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{error}</p>
                    </div>
                    <button onClick={() => setError(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Fault Types List */}
            {datasetInfo?.fault_types?.length > 0 && (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Eye size={18} color="var(--text-secondary)" />
                        Detected Fault Types ({datasetInfo.fault_types.length})
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {datasetInfo.fault_types.map(ft => (
                            <span key={ft} style={{
                                padding: '0.3rem 0.7rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                background: ft === 'Normal Operation' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                                color: ft === 'Normal Operation' ? 'var(--success)' : 'var(--danger)',
                                border: `1px solid ${ft === 'Normal Operation' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.25)'}`,
                            }}>
                                {ft}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Dataset Preview Table */}
            {datasetInfo?.preview?.length > 0 && (
                <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
                    <h3 style={{ margin: '0 0 1rem' }}>Dataset Preview (First 5 Rows)</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                            <thead>
                                <tr>
                                    {Object.keys(datasetInfo.preview[0]).map(col => (
                                        <th key={col} style={thStyle}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {datasetInfo.preview.map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                                        {Object.values(row).map((val, j) => (
                                            <td key={j} style={tdStyle}>
                                                {typeof val === 'number' ? val.toFixed(3) : String(val)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
};

const thStyle = {
    padding: '0.6rem 0.75rem',
    textAlign: 'left',
    color: 'var(--text-secondary)',
    fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const tdStyle = {
    padding: '0.5rem 0.75rem',
    color: 'var(--text-primary)',
};

export default DataSource;
