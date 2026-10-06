import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  HardDriveDownload, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ExternalLink, 
  Camera, 
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function CentreDashboard({ 
  centres, 
  onSelectCentre, 
  onReviewAlert, 
  onOpenAttendanceModal,
  onOpenAddCentreModal,
  onOpenConnectCameraModal,
  onViewTemporalDiff,
  systemHealth
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedScheme, setSelectedScheme] = useState('ALL');

  // Filter calculations
  const states = ['ALL', ...new Set(centres.map(c => c.state).filter(Boolean))];
  const schemes = ['ALL', ...new Set(centres.map(c => c.scheme?.split(' - ')[0]).filter(Boolean))];

  const filteredCentres = centres.filter(centre => {
    const matchesSearch = centre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          centre.centre_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          centre.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'ALL' || centre.state === selectedState;
    const matchesStatus = selectedStatus === 'ALL' || centre.status === selectedStatus;
    const matchesScheme = selectedScheme === 'ALL' || (centre.scheme && centre.scheme.includes(selectedScheme));
    return matchesSearch && matchesState && matchesStatus && matchesScheme;
  });

  // KPI calculations
  const totalCentres = centres.length;
  const compliantCount = centres.filter(c => c.status === 'Compliant').length;
  const attentionCount = centres.filter(c => c.status === 'Attention').length;
  const criticalCount = centres.filter(c => c.status === 'Critical').length;
  const totalReportedTrainees = centres.reduce((sum, c) => sum + (c.reported_attendance || 0), 0);
  const totalAiDetectedTrainees = centres.reduce((sum, c) => sum + (c.ai_attendance || 0), 0);
  const totalPendingAlerts = centres.reduce((sum, c) => sum + (c.pending_alerts_count || 0), 0);

  const getScoreClass = (score) => {
    if (score >= 85) return 'high';
    if (score >= 65) return 'mid';
    return 'low';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Compliant':
        return <span className="badge badge-compliant"><CheckCircle2 size={12} /> Compliant</span>;
      case 'Attention':
        return <span className="badge badge-attention"><AlertTriangle size={12} /> Attention</span>;
      case 'Critical':
        return <span className="badge badge-critical"><AlertOctagon size={12} /> Critical</span>;
      default:
        return <span className="badge badge-info">{status}</span>;
    }
  };

  return (
    <div>
      {/* Stat Cards Banner */}
      <div className="stats-banner">
        <div className="stat-card">
          <div>
            <div className="stat-label">Centres Monitored</div>
            <div className="stat-value">{totalCentres}</div>
            <div className="stat-subtext">Across {states.length - 1} States / Territories</div>
          </div>
          <div className="stat-icon">
            <Building2 size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Trainees Audited Today</div>
            <div className="stat-value">
              {totalAiDetectedTrainees} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalReportedTrainees}</span>
            </div>
            <div className="stat-subtext">AI Visually Detected vs Reported</div>
          </div>
          <div className="stat-icon" style={{ color: '#10b981' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Compliance Overview</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              {Math.round((compliantCount / (totalCentres || 1)) * 100)}%
            </div>
            <div className="stat-subtext">{criticalCount} Critical • {attentionCount} Attention</div>
          </div>
          <div className="stat-icon" style={{ color: '#fbbf24' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Active Actionable Alerts</div>
            <div className="stat-value" style={{ color: totalPendingAlerts > 0 ? '#f87171' : '#34d399' }}>
              {totalPendingAlerts}
            </div>
            <div className="stat-subtext">Requires Human Verification</div>
          </div>
          <div className="stat-icon" style={{ color: '#f87171' }}>
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Bandwidth Conserved</div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>
              {systemHealth?.total_bandwidth_saved_gb || '2.74'} <span style={{ fontSize: '0.9rem' }}>GB</span>
            </div>
            <div className="stat-subtext">Periodic Edge Frame Extraction</div>
          </div>
          <div className="stat-icon" style={{ color: '#38bdf8' }}>
            <HardDriveDownload size={22} />
          </div>
        </div>
      </div>

      {/* Bandwidth Savings Highlight */}
      <div className="bandwidth-meter-box">
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f8fafc' }}>
            <HardDriveDownload size={15} style={{ color: '#34d399' }} />
            Low-Bandwidth Edge Architecture Active (PRD Section 12)
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            Periodic snapshots (1–5 min) processed locally with edge CV. Lightweight JSON metadata + face-blurred frames transmitted.
            Network bandwidth reduction: <strong>98.6%</strong>.
          </div>
        </div>
        <div style={{ textAlign: 'right', minWidth: '140px' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>98.6% Saved</div>
          <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>44 KB/snap vs 8.5 MB stream</div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="section-header">
        <div className="section-title">
          <Building2 size={20} style={{ color: '#38bdf8' }} />
          <span>Registered Training Centres ({filteredCentres.length})</span>
        </div>

        <div className="section-actions">
          <button 
            className="btn-primary"
            onClick={onOpenAddCentreModal}
            title="Register a new training centre into the compliance platform"
          >
            <span>+ Add Centre</span>
          </button>

          <div className="search-input-wrapper">
            <Search size={15} />
            <input 
              type="text"
              placeholder="Search centre name, ID, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select 
            value={selectedState} 
            onChange={(e) => setSelectedState(e.target.value)}
            className="filter-select"
          >
            {states.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All States' : s}</option>)}
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="Compliant">Compliant</option>
            <option value="Attention">Attention</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Table of Centres */}
      <div className="table-card">
        {centres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <Building2 size={36} style={{ color: '#334155', marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>No Training Centres Registered Yet</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.2rem', maxWidth: '420px', margin: '0.2rem auto 1rem auto' }}>
              Default mock centres have been cleared. Register your training centre below, or upload a CCTV video to extract snapshots and analyze differences.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={onOpenAddCentreModal}>
                <span>+ Register First Centre</span>
              </button>
            </div>
          </div>
        ) : filteredCentres.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
            No training centres match your search and filter criteria.
          </div>
        ) : (
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Centre Identifier</th>
                <th>Accreditation Scheme</th>
                <th>Compliance Score</th>
                <th>Status</th>
                <th>Attendance (Rep vs AI)</th>
                <th>Cameras & Edge</th>
                <th>Pending Alerts</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCentres.map((centre) => {
                const delta = centre.discrepancy || 0;
                let deltaClass = 'delta-ok';
                if (delta <= -10) deltaClass = 'delta-bad';
                else if (delta < 0) deltaClass = 'delta-warn';

                return (
                  <tr key={centre.centre_id}>
                  <td>
                    <div className="centre-name-cell">
                      <div className="centre-primary-name">{centre.name}</div>
                      <div className="centre-meta">
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>{centre.centre_id}</span> • {centre.location}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {centre.scheme}
                    </div>
                  </td>
                  <td>
                    <div className={`score-pill ${getScoreClass(centre.score)}`}>
                      {centre.score}
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(centre.status)}
                  </td>
                  <td>
                    <div className="attendance-comparison-pill">
                      <span>Rep: <strong>{centre.reported_attendance ?? '--'}</strong></span>
                      <span>|</span>
                      <span>AI: <strong>{centre.ai_attendance ?? '--'}</strong></span>
                      <span className={`delta-pill ${deltaClass}`}>
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <Camera size={13} style={{ color: centre.cameras_online === centre.cameras_total ? '#10b981' : '#f59e0b' }} />
                      <span>{centre.cameras_online}/{centre.cameras_total} Online</span>
                    </div>
                  </td>
                  <td>
                    {centre.pending_alerts_count > 0 ? (
                      <span className="badge badge-critical">
                        {centre.pending_alerts_count} Pending {centre.critical_alerts_count > 0 ? `(${centre.critical_alerts_count} Crit)` : ''}
                      </span>
                    ) : (
                      <span className="badge badge-compliant">0 Alerts</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => onSelectCentre(centre.centre_id)}
                        title="View Detailed Center Analytics"
                        style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                      >
                        <span>Details</span>
                        <ChevronRight size={12} />
                      </button>

                      <button 
                        className="btn-secondary"
                        onClick={() => onViewTemporalDiff(centre.centre_id)}
                        title="Compare Previous vs Current Snapshot (Missing Items Delta)"
                        style={{ padding: '2px 6px', fontSize: '0.72rem', color: '#93c5fd' }}
                      >
                        <span>Diff</span>
                      </button>

                      <button 
                        className="btn-secondary"
                        onClick={() => onOpenConnectCameraModal(centre.centre_id)}
                        title="Connect New Camera to this centre"
                        style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                      >
                        <Camera size={12} />
                      </button>

                      {centre.pending_alerts_count > 0 && (
                        <button 
                          className="btn-danger"
                          onClick={() => onReviewAlert(centre.centre_id)}
                          title="Inspect AI Evidence Snapshot"
                          style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                        >
                          <span>Review</span>
                        </button>
                      )}

                      <button 
                        className="btn-secondary"
                        onClick={() => onOpenAttendanceModal(centre.centre_id)}
                        title="Record Official Attendance"
                        style={{ padding: '2px 6px', fontSize: '0.72rem' }}
                      >
                        <FileSpreadsheet size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
