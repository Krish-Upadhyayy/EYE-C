import React, { useState } from 'react';
import { 
  Layers, 
  Armchair, 
  Wrench, 
  Monitor, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Building2,
  Cpu,
  Info,
  Plus,
  Camera,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Check,
  Hammer
} from 'lucide-react';
import AddInfrastructureModal from './AddInfrastructureModal';

export default function InfrastructureView({ 
  centres = [], 
  infrastructureItems = [],
  snapshots = [],
  onAddInfrastructure,
  onRefreshData
}) {
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0]?.centre_id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditFeedback, setAuditFeedback] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'missing', 'damaged', 'intact'

  const activeCentre = centres.find(c => c.centre_id === selectedCentreId) || centres[0];
  const items = infrastructureItems.filter(i => i.centre_id === selectedCentreId || !i.centre_id);

  const totalApproved = items.reduce((sum, i) => sum + i.approved_quantity, 0);
  const totalDetected = items.reduce((sum, i) => sum + (i.detected_quantity || 0), 0);
  const missingItemsCount = items.filter(i => (i.detected_quantity || 0) < i.approved_quantity).length;
  const damagedItemsCount = items.filter(i => i.is_damaged || (i.condition_detected && i.condition_detected.toLowerCase().includes('damaged'))).length;

  // Run AI snapshot audit of physical infrastructure
  const handleRunSnapshotAudit = async (simulateDamage = false, simulateShortage = true) => {
    if (!selectedCentreId && centres.length === 0) return;
    setIsAuditing(true);
    try {
      const res = await fetch(`/api/centres/${selectedCentreId || centres[0]?.centre_id}/infrastructure/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulate_damage: simulateDamage,
          simulate_shortage: simulateShortage,
          snapshot_id: snapshots[0]?.snapshot_id
        })
      });
      const data = await res.json();
      setAuditFeedback({
        type: 'success',
        text: `CCTV Snapshot Audit Complete: ${data.summary.shortages_found} shortages and ${data.summary.damaged_found} damaged equipment flags identified.`
      });
      if (onRefreshData) onRefreshData();
      setTimeout(() => setAuditFeedback(null), 6000);
    } catch (err) {
      console.error(err);
      setAuditFeedback({
        type: 'error',
        text: 'Failed to run snapshot audit. Please check server connection.'
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Quick action: update item condition
  const handleUpdateItemStatus = async (itemId, newCondition, isDamaged = false, isMissing = false) => {
    try {
      await fetch(`/api/infrastructure/${itemId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition_detected: newCondition,
          is_damaged: isDamaged,
          is_missing: isMissing
        })
      });
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const isMissing = (item.detected_quantity || 0) < item.approved_quantity;
    const isDamaged = item.is_damaged || (item.condition_detected && item.condition_detected.toLowerCase().includes('damaged'));

    if (activeFilter === 'missing') return isMissing;
    if (activeFilter === 'damaged') return isDamaged;
    if (activeFilter === 'intact') return !isMissing && !isDamaged;
    return true;
  });

  return (
    <div>
      {/* Top Header Bar */}
      <div className="section-header">
        <div className="section-title">
          <Layers size={18} style={{ color: '#facc15' }} />
          <span>Physical Infrastructure & Seating Compliance</span>
          <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>
            {items.length} Sanctioned Assets
          </span>
          {missingItemsCount > 0 && (
            <span className="badge badge-critical">
              {missingItemsCount} Missing Items
            </span>
          )}
          {damagedItemsCount > 0 && (
            <span className="badge badge-attention">
              {damagedItemsCount} Damaged / Defect
            </span>
          )}
        </div>

        <div className="section-actions">
          {centres.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Centre:</span>
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
            </div>
          )}

          {/* Upload Infrastructure Button */}
          <button 
            className="btn-primary"
            onClick={() => setIsAddModalOpen(true)}
            style={{ padding: '4px 10px' }}
          >
            <Plus size={13} />
            <span>Upload Physical Infrastructure</span>
          </button>

          {/* Audit from Snapshot Button */}
          <button 
            className="btn-secondary"
            onClick={() => handleRunSnapshotAudit(false, true)}
            disabled={isAuditing || items.length === 0}
            style={{ padding: '4px 10px' }}
            title="Scan latest CCTV snapshot to detect missing units or shortages"
          >
            <Camera size={13} style={{ color: '#facc15' }} />
            <span>{isAuditing ? 'Auditing Snapshot...' : 'Audit from Snapshot'}</span>
          </button>

          {/* Simulate Damage Audit Test */}
          <button 
            className="btn-secondary"
            onClick={() => handleRunSnapshotAudit(true, true)}
            disabled={isAuditing || items.length === 0}
            style={{ padding: '4px 10px', color: '#f87171' }}
            title="Simulate CCTV detection of damaged casing / screen"
          >
            <Hammer size={12} />
            <span>Test Damaged Hardware Flag</span>
          </button>
        </div>
      </div>

      {/* Audit Feedback Toast */}
      {auditFeedback && (
        <div style={{
          padding: '0.5rem 0.75rem',
          marginBottom: '0.65rem',
          borderRadius: '4px',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: auditFeedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(250, 204, 21, 0.15)',
          border: `1px solid ${auditFeedback.type === 'error' ? '#ef4444' : '#facc15'}`,
          color: auditFeedback.type === 'error' ? '#fca5a5' : '#fef08a'
        }}>
          {auditFeedback.type === 'error' ? <AlertOctagon size={15} /> : <CheckCircle2 size={15} />}
          <span>{auditFeedback.text}</span>
        </div>
      )}

      {/* Explanatory Banner */}
      <div className="probabilistic-banner" style={{ marginBottom: '0.65rem' }}>
        <Sparkles size={16} style={{ color: '#facc15', minWidth: '16px' }} />
        <div>
          <strong>Physical Infrastructure Verification & Damage Detection:</strong>
          <div>
            Upload and register your sanctioned physical assets (workstations, machinery, seating desks). 
            When CCTV snapshots are evaluated, the computer vision engine <strong>compares detected units against approved quantities 
            and flags missing equipment, bay shortages, or damaged/malfunctioning hardware</strong>.
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-banner" style={{ marginBottom: '0.65rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-label">Sanctioned Seating Capacity (FR-08)</div>
            <div className="stat-value" style={{ color: '#facc15' }}>
              {activeCentre?.approved_seating_capacity || 30} <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>approved desks</span>
            </div>
            <div className="stat-subtext">Approved accreditation capacity</div>
          </div>
          <div className="stat-icon" style={{ color: '#facc15' }}>
            <Armchair size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Approved Inventory Units</div>
            <div className="stat-value" style={{ color: '#ffffff' }}>
              {totalApproved} <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>total items</span>
            </div>
            <div className="stat-subtext">{items.length} registered asset categories</div>
          </div>
          <div className="stat-icon" style={{ color: '#38bdf8' }}>
            <Layers size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Snapshot Detected Quantity</div>
            <div className="stat-value" style={{ color: totalDetected < totalApproved ? '#f87171' : '#34d399' }}>
              {totalDetected} <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>/ {totalApproved} Units</span>
            </div>
            <div className="stat-subtext">
              {totalDetected < totalApproved ? `Deficit of ${totalApproved - totalDetected} units in CCTV bay` : '100% Inventory Verified'}
            </div>
          </div>
          <div className="stat-icon" style={{ color: totalDetected < totalApproved ? '#ef4444' : '#10b981' }}>
            <Monitor size={20} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Damaged / Defect Flags</div>
            <div className="stat-value" style={{ color: damagedItemsCount > 0 ? '#f87171' : '#34d399' }}>
              {damagedItemsCount} <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>assets</span>
            </div>
            <div className="stat-subtext">
              {damagedItemsCount > 0 ? 'Hardware damage detected' : 'All items intact'}
            </div>
          </div>
          <div className="stat-icon" style={{ color: damagedItemsCount > 0 ? '#ef4444' : '#10b981' }}>
            <Wrench size={20} />
          </div>
        </div>
      </div>

      {/* Filter Buttons & Asset Table Card */}
      <div className="table-card">
        <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
          <strong style={{ fontSize: '0.75rem', color: '#ffffff' }}>
            Sanctioned Physical Infrastructure Ledger & CCTV Audit Status
          </strong>

          {/* Filter Pills */}
          <div style={{ display: 'flex', background: 'var(--bg-input)', padding: '2px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <button 
              className={`nav-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
              style={{ padding: '2px 8px', fontSize: '0.68rem' }}
              onClick={() => setActiveFilter('all')}
            >
              All Assets ({items.length})
            </button>
            <button 
              className={`nav-tab-btn ${activeFilter === 'missing' ? 'active' : ''}`}
              style={{ padding: '2px 8px', fontSize: '0.68rem', color: '#f87171' }}
              onClick={() => setActiveFilter('missing')}
            >
              Missing / Shortage ({missingItemsCount})
            </button>
            <button 
              className={`nav-tab-btn ${activeFilter === 'damaged' ? 'active' : ''}`}
              style={{ padding: '2px 8px', fontSize: '0.68rem', color: '#fbbf24' }}
              onClick={() => setActiveFilter('damaged')}
            >
              Damaged ({damagedItemsCount})
            </button>
            <button 
              className={`nav-tab-btn ${activeFilter === 'intact' ? 'active' : ''}`}
              style={{ padding: '2px 8px', fontSize: '0.68rem', color: '#34d399' }}
              onClick={() => setActiveFilter('intact')}
            >
              Intact
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <Layers size={36} style={{ color: '#475569', marginBottom: '0.65rem' }} />
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>No Physical Infrastructure Registered Yet</h4>
            <p style={{ fontSize: '0.74rem', marginTop: '0.35rem', maxWidth: '440px', margin: '0.35rem auto 1rem' }}>
              Click <strong>"Upload Physical Infrastructure"</strong> above to register approved equipment, workstations, and seating. 
              The system will then cross-check them against CCTV snapshots to detect missing or damaged items.
            </p>
            <button 
              className="btn-primary"
              onClick={() => setIsAddModalOpen(true)}
              style={{ padding: '4px 12px' }}
            >
              <Plus size={13} />
              <span>Upload Physical Infrastructure</span>
            </button>
          </div>
        ) : (
          <table className="compliance-table">
            <thead>
              <tr>
                <th>Asset / Equipment Category</th>
                <th>Bay / Location</th>
                <th>Approved Sanction</th>
                <th>Snapshot Detected</th>
                <th>Discrepancy Delta</th>
                <th>Operability & Condition (FR-10)</th>
                <th>Compliance Status</th>
                <th>Audit Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => {
                const diff = (item.detected_quantity || 0) - item.approved_quantity;
                const isShortage = diff < 0;
                const isDamaged = item.is_damaged || (item.condition_detected && item.condition_detected.toLowerCase().includes('damaged'));

                return (
                  <tr key={item.item_id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc' }}>{item.name || item.category}</div>
                      <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                        Category: {item.category} • ID: {item.item_id}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', color: '#d4d4d8' }}>{item.location_bay || 'Main Bay'}</span>
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{item.approved_quantity}</strong>
                    </td>
                    <td>
                      <strong style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: isShortage ? '#f87171' : '#34d399' }}>
                        {item.detected_quantity !== undefined ? item.detected_quantity : item.approved_quantity}
                      </strong>
                    </td>
                    <td>
                      <span className={`delta-pill ${isShortage ? 'delta-bad' : 'delta-ok'}`}>
                        {diff === 0 ? '✓ Matched' : `${diff} Units`}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.72rem', color: isDamaged ? '#f87171' : isShortage ? '#fbbf24' : '#34d399', fontWeight: isDamaged ? 700 : 500 }}>
                        {item.condition_detected || 'Operational & Intact'}
                      </div>
                      {item.damage_details && (
                        <div style={{ fontSize: '0.64rem', color: '#fca5a5', marginTop: '0.15rem' }}>
                          ⚠️ {item.damage_details}
                        </div>
                      )}
                    </td>
                    <td>
                      {isShortage ? (
                        <span className="badge badge-critical">Shortage Flagged</span>
                      ) : isDamaged ? (
                        <span className="badge badge-critical">Damaged Flagged</span>
                      ) : (
                        <span className="badge badge-compliant">Sanction Met</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        {isDamaged || isShortage ? (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleUpdateItemStatus(item.item_id, 'Operational & Intact', false, false)}
                            style={{ padding: '2px 6px', fontSize: '0.64rem', color: '#34d399' }}
                            title="Mark equipment as verified intact and operational"
                          >
                            <Check size={11} />
                            <span>Mark Intact</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleUpdateItemStatus(item.item_id, 'Damaged / Hardware Malfunction Flagged', true, false)}
                            style={{ padding: '2px 6px', fontSize: '0.64rem', color: '#f87171' }}
                            title="Flag this asset as damaged or malfunctioning"
                          >
                            <Hammer size={11} />
                            <span>Flag Damage</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Infrastructure Modal */}
      {isAddModalOpen && (
        <AddInfrastructureModal
          centres={centres}
          defaultCentreId={selectedCentreId}
          onClose={() => setIsAddModalOpen(false)}
          onAddInfrastructure={onAddInfrastructure}
        />
      )}
    </div>
  );
}
