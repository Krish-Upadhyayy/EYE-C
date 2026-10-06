import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  Eye, 
  Layers, 
  ArrowRight, 
  AlertTriangle,
  SlidersHorizontal,
  SplitSquareVertical,
  Video,
  Camera
} from 'lucide-react';

export default function TemporalDiffView({ centres }) {
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0]?.centre_id || '');
  const [diffData, setDiffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('side_by_side'); // 'side_by_side' or 'diff_overlay'
  const [showGhostOverlay, setShowGhostOverlay] = useState(true);

  useEffect(() => {
    if (centres.length > 0 && !selectedCentreId) {
      setSelectedCentreId(centres[0].centre_id);
    }
  }, [centres]);

  useEffect(() => {
    if (!selectedCentreId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/centres/${selectedCentreId}/temporal-diff`)
      .then(res => res.json())
      .then(data => {
        setDiffData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCentreId]);

  const activeCentre = centres.find(c => c.centre_id === selectedCentreId) || centres[0];

  if (centres.length === 0) {
    return (
      <div>
        <div className="section-header">
          <div className="section-title">
            <GitCompare size={18} style={{ color: '#f87171' }} />
            <span>Temporal Snapshot Comparison (Previous vs Current Delta Diff)</span>
          </div>
        </div>
        <div className="table-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <GitCompare size={36} style={{ color: '#475569', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>No Centres Registered Yet</h3>
          <p style={{ fontSize: '0.75rem', marginTop: '0.35rem', maxWidth: '460px', margin: '0.35rem auto 0' }}>
            Please add a training centre or navigate to the <strong>CCTV Video</strong> tab to upload a video and extract snapshot frames.
          </p>
        </div>
      </div>
    );
  }

  const prevSnap = diffData?.previous_snapshot;
  const currSnap = diffData?.current_snapshot;
  const deltaInfo = diffData?.temporal_delta;
  const hasFrames = diffData?.has_sufficient_frames && prevSnap && currSnap;

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <GitCompare size={18} style={{ color: '#f87171' }} />
          <span>Temporal Snapshot Comparison (Previous vs Current Delta Diff)</span>
        </div>

        <div className="section-actions">
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target Centre:</span>
          <select 
            value={selectedCentreId} 
            onChange={(e) => setSelectedCentreId(e.target.value)}
            className="filter-select"
          >
            {centres.map(c => (
              <option key={c.centre_id} value={c.centre_id}>
                {c.name} ({c.centre_id})
              </option>
            ))}
          </select>

          {hasFrames && (
            <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '2px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <button 
                className={`nav-tab-btn ${viewMode === 'side_by_side' ? 'active' : ''}`}
                style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                onClick={() => setViewMode('side_by_side')}
              >
                Side-by-Side
              </button>
              <button 
                className={`nav-tab-btn ${viewMode === 'diff_overlay' ? 'active' : ''}`}
                style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                onClick={() => setViewMode('diff_overlay')}
              >
                Ghost Delta Overlay
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="probabilistic-banner" style={{ marginBottom: '0.65rem' }}>
        <AlertTriangle size={16} style={{ color: '#fbbf24', minWidth: '16px' }} />
        <div>
          <strong>Temporal Difference Verification Engine:</strong>
          <div>
            The edge CV system compares successive snapshots taken over time. If trainees or equipment items were
            <strong> present in the previous baseline frame but missing in the current frame</strong>, the delta algorithm
            flags the difference and isolates the discrepancy.
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Analyzing temporal delta frames...</div>
      ) : !hasFrames ? (
        <div className="table-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Camera size={34} style={{ color: '#475569', marginBottom: '0.65rem' }} />
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>
            {currSnap ? '1 Snapshot Frame Recorded — Need At Least 2 To Compare' : 'No Snapshot Frames Recorded for this Centre'}
          </h4>
          <p style={{ fontSize: '0.74rem', marginTop: '0.35rem', maxWidth: '520px', margin: '0.35rem auto 0' }}>
            Temporal difference analysis requires at least two consecutive snapshots (Baseline T-1 and Current T-0). 
            Navigate to the <strong>CCTV Video</strong> tab to upload a video recording and extract snapshots along the timeline.
          </p>
        </div>
      ) : (
        <div>
          {/* Key Metric Bar */}
          <div className="stats-banner" style={{ marginBottom: '0.65rem' }}>
            <div className="stat-card">
              <div>
                <div className="stat-label">Previous Baseline (T-1)</div>
                <div className="stat-value" style={{ color: '#34d399' }}>
                  {deltaInfo?.previous_count} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>trainees</span>
                </div>
                <div className="stat-subtext">Timestamp: {prevSnap.video_timestamp || 'Initial'}</div>
              </div>
              <div className="stat-icon" style={{ color: '#10b981' }}>
                <Clock size={18} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-label">Current Snapshot (T-0)</div>
                <div className="stat-value" style={{ color: '#f87171' }}>
                  {deltaInfo?.current_count} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>trainees</span>
                </div>
                <div className="stat-subtext">Timestamp: {currSnap.video_timestamp || 'Current'}</div>
              </div>
              <div className="stat-icon" style={{ color: '#f87171' }}>
                <AlertOctagon size={18} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-label">Net Presence Delta</div>
                <div className="stat-value" style={{ color: deltaInfo?.people_delta < 0 ? '#f87171' : '#34d399' }}>
                  {deltaInfo?.people_delta > 0 ? `+${deltaInfo.people_delta}` : deltaInfo?.people_delta}
                </div>
                <div className="stat-subtext">
                  {deltaInfo?.people_delta < 0 ? 'Trainees Absent / Departed' : 'Trainee Headcount Variance'}
                </div>
              </div>
              <div className="stat-icon" style={{ color: '#fbbf24' }}>
                <GitCompare size={18} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-label">Missing Items Detected</div>
                <div className="stat-value" style={{ color: deltaInfo?.missing_items?.length > 0 ? '#f87171' : '#34d399' }}>
                  {deltaInfo?.missing_items?.length || 0} Items
                </div>
                <div className="stat-subtext">
                  {deltaInfo?.missing_items?.length > 0 ? 'Was present before, now missing' : 'Zero deficits identified'}
                </div>
              </div>
              <div className="stat-icon" style={{ color: deltaInfo?.missing_items?.length > 0 ? '#ef4444' : '#10b981' }}>
                <AlertTriangle size={18} />
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-label">Interval Time Gap</div>
                <div className="stat-value" style={{ color: '#93c5fd' }}>
                  {deltaInfo?.time_gap}
                </div>
                <div className="stat-subtext">Between Extracted Frames</div>
              </div>
              <div className="stat-icon" style={{ color: '#38bdf8' }}>
                <Clock size={18} />
              </div>
            </div>
          </div>

          {/* Side-by-side or Overlay Visual Viewport */}
          {viewMode === 'side_by_side' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
              {/* Previous Frame (Baseline) */}
              <div className="table-card">
                <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#34d399' }} />
                    <strong style={{ fontSize: '0.75rem' }}>PREVIOUS FRAME ({prevSnap.video_timestamp || 'T-1 Baseline'} - Was Present)</strong>
                  </div>
                  <span className="badge badge-compliant">{prevSnap.people_count} Trainees Detected</span>
                </div>

                <div className="cctv-screen-wrapper" style={{ height: '240px' }}>
                  {prevSnap.image_data || prevSnap.evidence_uri ? (
                    <img src={prevSnap.image_data || prevSnap.evidence_uri} alt="Previous CCTV Frame" className="cctv-image" />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      Baseline Frame Frame
                    </div>
                  )}

                  <svg className="annotation-svg-layer" viewBox="0 0 960 540" preserveAspectRatio="none">
                    {(prevSnap.bounding_boxes || []).slice(0, 10).map((b, i) => (
                      <g key={i}>
                        <rect x={b.x} y={b.y} width={b.w} height={b.h} stroke="#10b981" strokeWidth="2" fill="rgba(16, 185, 129, 0.15)" />
                        <rect x={b.x} y={Math.max(0, b.y - 18)} width="110" height="18" fill="#059669" rx="2" />
                        <text x={b.x + 4} y={Math.max(12, b.y - 5)} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          PRESENT #{i + 1}
                        </text>
                      </g>
                    ))}
                  </svg>
                  <div className="cctv-osd-overlay" style={{ padding: '0.45rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '2px', color: '#34d399' }}>
                      {prevSnap.source_camera || prevSnap.source_video_name || 'CCTV'} • {prevSnap.video_timestamp || 'T-1'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Frame (With Discrepancy) */}
              <div className="table-card">
                <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertOctagon size={14} style={{ color: deltaInfo.people_delta < 0 ? '#f87171' : '#34d399' }} />
                    <strong style={{ fontSize: '0.75rem', color: deltaInfo.people_delta < 0 ? '#f87171' : '#f8fafc' }}>
                      CURRENT FRAME ({currSnap.video_timestamp || 'T-0'} {deltaInfo.people_delta < 0 ? '- Discrepancy Flagged' : '- Verified'})
                    </strong>
                  </div>
                  <span className={`badge ${deltaInfo.people_delta < 0 ? 'badge-critical' : 'badge-compliant'}`}>
                    {currSnap.people_count} Trainees ({deltaInfo.people_delta > 0 ? `+${deltaInfo.people_delta}` : deltaInfo.people_delta})
                  </span>
                </div>

                <div className="cctv-screen-wrapper" style={{ height: '240px' }}>
                  {currSnap.image_data || currSnap.evidence_uri ? (
                    <img src={currSnap.image_data || currSnap.evidence_uri} alt="Current CCTV Frame" className="cctv-image" />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                      Current Frame
                    </div>
                  )}

                  <svg className="annotation-svg-layer" viewBox="0 0 960 540" preserveAspectRatio="none">
                    {(currSnap.bounding_boxes || []).slice(0, 10).map((b, i) => (
                      <g key={i}>
                        <rect x={b.x} y={b.y} width={b.w} height={b.h} stroke="#38bdf8" strokeWidth="2" fill="rgba(56, 189, 248, 0.15)" />
                        <rect x={b.x} y={Math.max(0, b.y - 18)} width="105" height="18" fill="#0284c7" rx="2" />
                        <text x={b.x + 4} y={Math.max(12, b.y - 5)} fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                          ACTIVE #{i + 1}
                        </text>
                      </g>
                    ))}

                    {/* Red ghost outline if trainees departed */}
                    {deltaInfo.people_delta < 0 && (
                      <g>
                        <rect x="520" y="240" width="180" height="160" stroke="#ef4444" strokeWidth="3" fill="rgba(239, 68, 68, 0.25)" strokeDasharray="6 3" />
                        <line x1="520" y1="240" x2="700" y2="400" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="520" y1="400" x2="700" y2="240" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                        <rect x="520" y="218" width="220" height="22" fill="#dc2626" rx="2" />
                        <text x="525" y="233" fill="#ffffff" fontSize="10.5" fontFamily="monospace" fontWeight="bold">
                          ABSENT NOW ({Math.abs(deltaInfo.people_delta)} TRAINEES DEFICIT)
                        </text>
                      </g>
                    )}
                  </svg>
                  <div className="cctv-osd-overlay" style={{ padding: '0.45rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '2px', color: deltaInfo.people_delta < 0 ? '#f87171' : '#34d399' }}>
                      {currSnap.source_camera || currSnap.source_video_name || 'CCTV'} • {currSnap.video_timestamp || 'T-0'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Diff Overlay View */
            <div className="table-card" style={{ marginBottom: '0.75rem' }}>
              <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                <strong style={{ fontSize: '0.75rem' }}>Composite Temporal Difference Overlay (Red Ghost Marks Missing Items)</strong>
                <button 
                  className="btn-secondary"
                  onClick={() => setShowGhostOverlay(!showGhostOverlay)}
                >
                  <Eye size={12} />
                  <span>{showGhostOverlay ? 'Hide Ghost Markers' : 'Show Ghost Markers'}</span>
                </button>
              </div>

              <div className="cctv-screen-wrapper" style={{ height: '360px' }}>
                <img src={currSnap.image_data || currSnap.evidence_uri || prevSnap.image_data || prevSnap.evidence_uri} alt="Temporal Diff Composite" className="cctv-image" />
                {showGhostOverlay && deltaInfo.people_delta < 0 && (
                  <svg className="annotation-svg-layer" viewBox="0 0 960 540" preserveAspectRatio="none">
                    <rect x="520" y="240" width="180" height="160" stroke="#ef4444" strokeWidth="3" fill="rgba(239, 68, 68, 0.25)" strokeDasharray="6 3" />
                    <rect x="520" y="215" width="260" height="25" fill="#dc2626" rx="3" />
                    <text x="525" y="232" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
                      ⚠ WAS PRESENT AT {prevSnap.video_timestamp} (NOW DEPARTED)
                    </text>
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Temporal Difference Audit Table */}
          <div className="table-card">
            <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '0.75rem' }}>
              Detailed Ledger: What Was Present Previously vs What Is Missing Now
            </div>

            <table className="compliance-table">
              <thead>
                <tr>
                  <th>Object / Resource Identifier</th>
                  <th>Status in Baseline Frame (T-1)</th>
                  <th>Status in Current Frame (T-0)</th>
                  <th>Temporal Delta Analysis</th>
                  <th>Compliance Verdict</th>
                </tr>
              </thead>
              <tbody>
                {deltaInfo.missing_items && deltaInfo.missing_items.length > 0 ? (
                  deltaInfo.missing_items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong style={{ color: '#f87171' }}>{item.name}</strong>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Category: {item.category}</div>
                      </td>
                      <td>
                        <span className="badge badge-compliant">Present in Frame</span>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                          Timestamp {prevSnap.video_timestamp || 'T-1'} ({prevSnap.people_count} trainees)
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-critical">{item.status}</span>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                          Timestamp {currSnap.video_timestamp || 'T-0'} ({currSnap.people_count} trainees)
                        </div>
                      </td>
                      <td style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </td>
                      <td>
                        <span className="badge badge-critical">{item.severity || 'Critical'} Non-Compliance</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-dim)' }}>
                      ✓ Zero discrepancies detected between baseline ({prevSnap.video_timestamp}) and current frame ({currSnap.video_timestamp}). Attendance is consistent.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
