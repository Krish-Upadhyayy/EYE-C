import React from 'react';
import { 
  Building2, 
  MapPin, 
  Award, 
  Users, 
  Cpu, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ShieldAlert, 
  Sliders, 
  Wrench, 
  Armchair, 
  History,
  Calendar
} from 'lucide-react';

export default function CentreDetail({ 
  centreId, 
  centres, 
  onBack, 
  onReviewAlert, 
  onOpenAttendanceModal,
  onOpenConnectCameraModal,
  onViewTemporalDiff
}) {
  const centre = centres.find(c => c.centre_id === centreId) || centres[0];
  if (!centre) return <div>No centre selected.</div>;

  const score = centre.scores_breakdown || {
    overall_score: centre.score || 85,
    attendance_score: 92,
    infrastructure_score: 88,
    seating_score: 95,
    workshop_score: 90,
    historical_score: 90
  };

  const getScoreColor = (val) => {
    if (val >= 85) return '#10b981';
    if (val >= 65) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      {/* Top Header Card */}
      <div className="table-card" style={{ padding: '0.85rem', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-info" style={{ fontFamily: 'var(--font-mono)' }}>{centre.centre_id}</span>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{centre.name}</h2>
              <span className={`badge ${centre.status === 'Compliant' ? 'badge-compliant' : centre.status === 'Attention' ? 'badge-attention' : 'badge-critical'}`}>
                {centre.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.72rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={12} style={{ color: '#38bdf8' }} /> {centre.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={12} style={{ color: '#fbbf24' }} /> {centre.scheme}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Armchair size={12} style={{ color: '#34d399' }} /> Approved Seating: {centre.approved_seating_capacity}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Wrench size={12} style={{ color: '#a78bfa' }} /> Workshop: {centre.workshop_requirement}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ textAlign: 'right', marginRight: '0.35rem' }}>
              <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Compliance Score</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: getScoreColor(score.overall_score), fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {score.overall_score}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>/100</span>
              </div>
            </div>

            <button 
              className="btn-secondary"
              onClick={() => onViewTemporalDiff(centre.centre_id)}
              title="Inspect previous vs current snapshot difference"
              style={{ color: '#93c5fd' }}
            >
              <span>Temporal Diff</span>
            </button>

            <button 
              className="btn-secondary"
              onClick={() => onOpenConnectCameraModal(centre.centre_id)}
              title="Connect a new camera"
            >
              <Camera size={13} />
              <span>Connect Camera</span>
            </button>

            <button 
              className="btn-primary"
              onClick={() => onOpenAttendanceModal(centre.centre_id)}
            >
              <Calendar size={13} />
              <span>Record Attendance</span>
            </button>
          </div>
        </div>

        {/* 5 Pillar Compliance Meters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem', marginTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Attendance (35%)</span>
              <strong style={{ color: getScoreColor(score.attendance_score) }}>{score.attendance_score}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${score.attendance_score}%`, background: getScoreColor(score.attendance_score) }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Inventory (25%)</span>
              <strong style={{ color: getScoreColor(score.infrastructure_score) }}>{score.infrastructure_score}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${score.infrastructure_score}%`, background: getScoreColor(score.infrastructure_score) }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Seating (15%)</span>
              <strong style={{ color: getScoreColor(score.seating_score) }}>{score.seating_score}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${score.seating_score}%`, background: getScoreColor(score.seating_score) }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Workshop (15%)</span>
              <strong style={{ color: getScoreColor(score.workshop_score) }}>{score.workshop_score}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${score.workshop_score}%`, background: getScoreColor(score.workshop_score) }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>SLA (10%)</span>
              <strong style={{ color: getScoreColor(score.historical_score) }}>{score.historical_score}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-bar-fill" style={{ width: `${score.historical_score}%`, background: getScoreColor(score.historical_score) }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Cameras and Edge Unit */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
        {/* Cameras Card */}
        <div className="table-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={18} style={{ color: '#38bdf8' }} />
            <span>Configured CCTV Cameras & Periodic Extraction Schedule</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {centre.cameras?.map((cam) => (
              <div key={cam.camera_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{cam.location}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    ID: {cam.camera_id} • Extraction Rate: 1 snapshot every 2 mins
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${cam.status === 'Online' ? 'badge-compliant' : cam.status === 'Degraded' ? 'badge-attention' : 'badge-critical'}`}>
                    {cam.status}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    Latency: {cam.latency_ms} ms
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            💡 <strong>Bandwidth Policy:</strong> Video is processed locally on the edge device. Only periodic frames (1 frame / 120s) with face blurring applied are retained as evidence. No continuous raw stream is uploaded.
          </div>
        </div>

        {/* Edge Compute Hardware Telemetry */}
        <div className="table-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} style={{ color: '#10b981' }} />
            <span>Edge Compute Unit (PRD Section 13)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Edge Hardware Model:</span>
              <strong>{centre.edge_device?.model || 'Jetson Orin Nano'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Local Unit Status:</span>
              <span className="badge badge-compliant">{centre.edge_device?.status || 'Active'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Offline Buffer Queue:</span>
              <span style={{ color: centre.edge_device?.buffer_queue_count > 0 ? '#fbbf24' : '#34d399', fontWeight: 700 }}>
                {centre.edge_device?.buffer_queue_count || 0} frames buffered
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Edge Inference CPU Load:</span>
              <strong>{centre.edge_device?.cpu_usage_pct || 28}%</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Thermal Operating Temp:</span>
              <strong>{centre.edge_device?.temperature_c || 44}°C</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.2rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Cumulative Bandwidth Saved:</span>
              <strong style={{ color: '#38bdf8' }}>{centre.edge_device?.bandwidth_saved_mb || 480} MB</strong>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => onReviewAlert(centre.centre_id)}
            >
              <ShieldAlert size={14} />
              <span>Inspect All Centre Alerts & Evidence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
