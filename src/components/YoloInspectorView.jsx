import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Terminal, 
  Sliders, 
  Play, 
  Layers, 
  CheckCircle2, 
  Code2, 
  HardDrive,
  Eye,
  Info
} from 'lucide-react';

export default function YoloInspectorView({ snapshots = [] }) {
  const [selectedSnapshotId, setSelectedSnapshotId] = useState(snapshots[0]?.snapshot_id || '');
  const [confThreshold, setConfThreshold] = useState(0.25);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [pipelineData, setPipelineData] = useState(null);
  const [isInferring, setIsInferring] = useState(false);
  const [activeJsonTab, setActiveJsonTab] = useState('detections'); // 'detections', 'input', 'output'

  useEffect(() => {
    if (snapshots.length > 0 && !selectedSnapshotId) {
      setSelectedSnapshotId(snapshots[0].snapshot_id);
    }
  }, [snapshots]);

  const activeSnapshot = snapshots.find(s => s.snapshot_id === selectedSnapshotId) || snapshots[0];

  const runYoloInference = async () => {
    if (!selectedSnapshotId && snapshots.length === 0) return;
    setIsInferring(true);
    try {
      const res = await fetch('/api/yolo/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshot_id: selectedSnapshotId || snapshots[0]?.snapshot_id,
          expected_people_count: activeSnapshot?.people_count || 6,
          conf_threshold: Number(confThreshold),
          iou_threshold: Number(iouThreshold)
        })
      });
      const data = await res.json();
      setPipelineData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInferring(false);
    }
  };

  useEffect(() => {
    if (snapshots.length > 0) {
      runYoloInference();
    }
  }, [selectedSnapshotId, confThreshold, iouThreshold, snapshots.length]);

  if (snapshots.length === 0) {
    return (
      <div>
        <div className="section-header">
          <div className="section-title">
            <Cpu size={18} style={{ color: '#38bdf8' }} />
            <span>YOLOv8/v11 Computer Vision Pipeline Inspector (Model In & Out)</span>
          </div>
        </div>
        <div className="table-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Cpu size={36} style={{ color: '#475569', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>No Snapshot Frames Available</h3>
          <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', maxWidth: '460px', margin: '0.35rem auto 0' }}>
            To inspect raw model input tensors and post-processed anchor detections, upload a video in the <strong>CCTV Video</strong> tab and extract snapshot frames.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <Cpu size={18} style={{ color: '#38bdf8' }} />
          <span>YOLOv8/v11 Computer Vision Pipeline Inspector (Model In & Out)</span>
        </div>

        <div className="section-actions">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Test Snapshot:</span>
          <select 
            value={selectedSnapshotId} 
            onChange={(e) => setSelectedSnapshotId(e.target.value)}
            className="filter-select"
          >
            {snapshots.map(s => (
              <option key={s.snapshot_id} value={s.snapshot_id}>
                [{s.snapshot_id}] {s.source_camera} ({s.people_count} trainees)
              </option>
            ))}
          </select>

          <button 
            className="btn-primary"
            onClick={runYoloInference}
            disabled={isInferring}
          >
            <Play size={13} />
            <span>{isInferring ? 'Processing Tensor...' : 'Re-Run YOLO Inference'}</span>
          </button>
        </div>
      </div>

      {/* Model Architecture & Specs Banner */}
      <div className="stats-banner" style={{ marginBottom: '0.65rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-label">Model Engine</div>
            <div className="stat-value" style={{ fontSize: '0.95rem', color: '#38bdf8' }}>
              YOLOv8x-Custom
            </div>
            <div className="stat-subtext">TensorRT FP16 Decoupled Head</div>
          </div>
          <div className="stat-icon" style={{ color: '#38bdf8' }}>
            <Cpu size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Model Input Tensor</div>
            <div className="stat-value" style={{ fontSize: '0.95rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              [1, 3, 640, 640]
            </div>
            <div className="stat-subtext">RGB Normalized [0.0, 1.0]</div>
          </div>
          <div className="stat-icon" style={{ color: '#10b981' }}>
            <Layers size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Raw Output Tensor</div>
            <div className="stat-value" style={{ fontSize: '0.95rem', color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>
              [1, 84, 8400]
            </div>
            <div className="stat-subtext">8,400 Anchor Candidates</div>
          </div>
          <div className="stat-icon" style={{ color: '#a78bfa' }}>
            <HardDrive size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Inference Latency</div>
            <div className="stat-value" style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {pipelineData?.inference_latency_ms || 16.8} <span style={{ fontSize: '0.75rem' }}>ms</span>
            </div>
            <div className="stat-subtext">Edge Jetson GPU Execution</div>
          </div>
          <div className="stat-icon" style={{ color: '#34d399' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Filtered Detections</div>
            <div className="stat-value" style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {pipelineData?.detections?.length || 0} Boxes
            </div>
            <div className="stat-subtext">Post-NMS Confirmed</div>
          </div>
          <div className="stat-icon" style={{ color: '#fbbf24' }}>
            <Sliders size={18} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.65rem', marginBottom: '0.65rem' }}>
        {/* Left: Viewport with Bounding Box Visualizer */}
        <div className="table-card">
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
            <strong style={{ fontSize: '0.75rem' }}>Rendered YOLO Detections Canvas</strong>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Input Resolution: 640x640 letterboxed
            </span>
          </div>

          <div className="cctv-screen-wrapper" style={{ height: '340px' }}>
            {(activeSnapshot?.image_data || activeSnapshot?.evidence_uri) ? (
              <img 
                src={activeSnapshot.image_data || activeSnapshot.evidence_uri} 
                alt="YOLO Inference Frame" 
                className="cctv-image"
              />
            ) : (
              <div style={{ height: '340px', background: '#070b14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                Extracted CCTV Video Frame
              </div>
            )}
            <svg className="annotation-svg-layer" viewBox="0 0 960 540" preserveAspectRatio="none">
              {pipelineData?.detections?.map((det, idx) => {
                const [x, y, w, h] = det.bbox_xywh;
                const isPerson = det.category === 'person';
                const isDiscrepancy = det.category === 'discrepancy';
                const strokeColor = isDiscrepancy ? '#ef4444' : isPerson ? '#10b981' : '#38bdf8';
                const fillColor = isDiscrepancy ? 'rgba(239, 68, 68, 0.2)' : isPerson ? 'rgba(16, 185, 129, 0.12)' : 'rgba(56, 189, 248, 0.12)';

                return (
                  <g key={`det-${idx}`}>
                    <rect x={x} y={y} width={w} height={h} stroke={strokeColor} strokeWidth="2" fill={fillColor} />
                    <rect x={x} y={y - 18} width={Math.max(w, 100)} height={18} fill={strokeColor} rx="2" />
                    <text x={x + 4} y={y - 5} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {det.class_name} {Math.round(det.confidence * 100)}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hyperparameter Controls */}
          <div style={{ padding: '0.55rem 0.75rem', background: 'var(--bg-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Confidence Filter Threshold:</span>
                <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{confThreshold}</strong>
              </div>
              <input 
                type="range" 
                min="0.10" 
                max="0.95" 
                step="0.05" 
                value={confThreshold}
                onChange={(e) => setConfThreshold(e.target.value)}
                className="weight-range"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>IoU NMS Overlap Threshold:</span>
                <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{iouThreshold}</strong>
              </div>
              <input 
                type="range" 
                min="0.10" 
                max="0.90" 
                step="0.05" 
                value={iouThreshold}
                onChange={(e) => setIouThreshold(e.target.value)}
                className="weight-range"
              />
            </div>
          </div>
        </div>

        {/* Right: In & Out Tensor Telemetry Inspector */}
        <div className="table-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Terminal size={14} style={{ color: '#38bdf8' }} />
              <strong style={{ fontSize: '0.75rem' }}>YOLO Tensor In & Out Inspector</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.2rem' }}>
              <button 
                className={`nav-tab-btn ${activeJsonTab === 'detections' ? 'active' : ''}`}
                style={{ padding: '1px 6px', fontSize: '0.68rem' }}
                onClick={() => setActiveJsonTab('detections')}
              >
                Detections [{pipelineData?.detections?.length || 0}]
              </button>
              <button 
                className={`nav-tab-btn ${activeJsonTab === 'input' ? 'active' : ''}`}
                style={{ padding: '1px 6px', fontSize: '0.68rem' }}
                onClick={() => setActiveJsonTab('input')}
              >
                Input Tensor
              </button>
              <button 
                className={`nav-tab-btn ${activeJsonTab === 'output' ? 'active' : ''}`}
                style={{ padding: '1px 6px', fontSize: '0.68rem' }}
                onClick={() => setActiveJsonTab('output')}
              >
                Output Tensor
              </button>
            </div>
          </div>

          <div style={{ padding: '0.6rem', flex: 1, overflowY: 'auto', background: 'var(--bg-input)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            {activeJsonTab === 'detections' && (
              <pre style={{ margin: 0, color: '#38bdf8', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(pipelineData?.detections || [], null, 2)}
              </pre>
            )}

            {activeJsonTab === 'input' && (
              <pre style={{ margin: 0, color: '#34d399', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(pipelineData?.model_input || {}, null, 2)}
              </pre>
            )}

            {activeJsonTab === 'output' && (
              <pre style={{ margin: 0, color: '#a78bfa', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(pipelineData?.model_output || {}, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
