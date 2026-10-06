import React, { useState } from 'react';
import { 
  FileCheck2, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Building2, 
  User, 
  Users, 
  Clock,
  ShieldCheck,
  History
} from 'lucide-react';

export default function AttendanceView({ 
  centres, 
  attendanceRecords, 
  onSubmitAttendance,
  preselectedCentreId 
}) {
  const [centreId, setCentreId] = useState(preselectedCentreId || centres[0]?.centre_id || '');
  const [batchName, setBatchName] = useState('Batch Morning - Practical Lab');
  const [reportedCount, setReportedCount] = useState(35);
  const [submittedBy, setSubmittedBy] = useState('Rajesh Sharma (Centre Head)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const selectedCentre = centres.find(c => c.centre_id === centreId) || centres[0];
  const centreHistory = attendanceRecords.filter(a => a.centre_id === centreId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await onSubmitAttendance(centreId, {
        batch_name: batchName,
        reported_count: Number(reportedCount),
        submitted_by: submittedBy
      });

      setStatusMessage({
        type: 'success',
        text: `Official attendance of ${reportedCount} trainees recorded for ${selectedCentre?.name || centreId}. Verified by edge AI comparison pipeline.`
      });

      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: 'Failed to record attendance. Please check network connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (centres.length === 0) {
    return (
      <div>
        <div className="section-header">
          <div className="section-title">
            <FileCheck2 size={18} style={{ color: '#38bdf8' }} />
            <span>Attendance Verification Ledger (FR-01 to FR-04)</span>
          </div>
        </div>
        <div className="table-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Users size={36} style={{ color: '#475569', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>No Centres Registered Yet</h3>
          <p style={{ fontSize: '0.75rem', marginTop: '0.35rem' }}>
            Please add a training centre first to record and cross-verify official trainee attendance with AI video estimates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <FileCheck2 size={20} style={{ color: '#38bdf8' }} />
          <span>Official Daily Attendance Submission (FR-01)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Submission Form Card */}
        <div className="table-card" style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: '#10b981' }} />
              <span>Record Daily Trainee Roll</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Training centres are required to record morning attendance headcounts at the commencement of training daily.
              Our edge AI system verifies presence against periodic CCTV frames without retaining personal facial data.
            </p>

            {statusMessage && (
              <div style={{ 
                background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
                color: statusMessage.type === 'success' ? '#34d399' : '#f87171',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                marginBottom: '1.25rem'
              }}>
                {statusMessage.text}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Select Registered Training Centre</label>
              <select 
                value={centreId} 
                onChange={(e) => setCentreId(e.target.value)}
                className="form-input"
              >
                {centres.map(c => (
                  <option key={c.centre_id} value={c.centre_id}>
                    [{c.centre_id}] {c.name} ({c.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Batch Identifier / Trade</label>
                <input 
                  type="text" 
                  value={batchName} 
                  onChange={(e) => setBatchName(e.target.value)}
                  className="form-input" 
                  placeholder="e.g. Batch A - Embedded Systems"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Physical Trainee Headcount</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={reportedCount} 
                  onChange={(e) => setReportedCount(e.target.value)}
                  className="form-input" 
                  required
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700 }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Submitting Official / Designation</label>
              <input 
                type="text" 
                value={submittedBy} 
                onChange={(e) => setSubmittedBy(e.target.value)}
                className="form-input" 
                placeholder="Full Name (Designation)"
                required
              />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1.25rem', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#bae6fd', fontWeight: 600, marginBottom: '0.2rem' }}>
                <ShieldCheck size={14} style={{ color: '#38bdf8' }} />
                <span>Declaration Under Skill Mission Guidelines</span>
              </div>
              I hereby certify that the reported headcount represents genuine trainees attending scheduled vocational training in compliance with government norms.
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
            >
              <Send size={16} />
              <span>{isSubmitting ? 'Recording & Cross-Checking...' : 'Submit Official Attendance'}</span>
            </button>
          </form>
        </div>

        {/* Previous Submissions Ledger */}
        <div className="table-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={16} style={{ color: '#38bdf8' }} />
            <span>Recent Attendance Records for {selectedCentre?.name}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {centreHistory.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
                No recent attendance records found.
              </div>
            ) : (
              centreHistory.map((rec) => (
                <div key={rec.attendance_id} style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{rec.batch_name}</strong>
                    <span className="badge badge-info" style={{ fontFamily: 'var(--font-mono)' }}>
                      {rec.reported_count} Trainees
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    Submitted by: {rec.submitted_by}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    Time: {new Date(rec.submitted_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
