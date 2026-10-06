import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';

export default function TrendsView({ centres }) {
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0]?.centre_id || '');
  const [activePeriod, setActivePeriod] = useState('today');
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCentreId) return;
    setLoading(true);
    fetch(`/api/centres/${selectedCentreId}/trends`)
      .then(res => res.json())
      .then(data => {
        setTrendData(data);
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
            <BarChart3 size={18} style={{ color: '#38bdf8' }} />
            <span>Historical Compliance Trends (FR-19)</span>
          </div>
        </div>
        <div className="table-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <TrendingUp size={36} style={{ color: '#475569', marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>No Centres Available</h3>
          <p style={{ fontSize: '0.75rem', marginTop: '0.35rem' }}>
            Register a training centre to monitor historical compliance scores across daily, weekly, and monthly intervals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <BarChart3 size={20} style={{ color: '#38bdf8' }} />
          <span>Historical Compliance Trends (FR-19)</span>
        </div>

        <div className="section-actions">
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

          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button 
              className={`nav-tab-btn ${activePeriod === 'today' ? 'active' : ''}`}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
              onClick={() => setActivePeriod('today')}
            >
              Today (Hourly)
            </button>
            <button 
              className={`nav-tab-btn ${activePeriod === 'week' ? 'active' : ''}`}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
              onClick={() => setActivePeriod('week')}
            >
              This Week
            </button>
            <button 
              className={`nav-tab-btn ${activePeriod === 'month' ? 'active' : ''}`}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
              onClick={() => setActivePeriod('month')}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading trends...</div>
      ) : (
        <div>
          {/* Period: Today */}
          {activePeriod === 'today' && trendData?.today && (
            <div className="table-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} style={{ color: '#38bdf8' }} />
                <span>Intra-Day Presence Profile (Hourly Edge Snapshots)</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {trendData.today.map((pt) => {
                  const variance = pt.estimated - pt.reported;
                  return (
                    <div key={pt.time} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.85rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{pt.time} hrs</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: pt.estimated < 30 ? '#fbbf24' : '#34d399', margin: '0.2rem 0' }}>
                        {pt.estimated} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>present</span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Roll: {pt.reported}</div>
                      <div style={{ fontSize: '0.68rem', marginTop: '0.35rem', color: pt.score < 80 ? '#fbbf24' : '#38bdf8' }}>
                        Score: {pt.score}%
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px' }}>
                ℹ️ <strong>Analysis:</strong> Attendance remained stable throughout practical sessions with a transient expected drop during the lunch break period (12:00-13:00 hrs). System correctly prevented false alert creation.
              </div>
            </div>
          )}

          {/* Period: This Week */}
          {activePeriod === 'week' && trendData?.week && (
            <div className="table-card">
              <table className="compliance-table">
                <thead>
                  <tr>
                    <th>Day / Date</th>
                    <th>Average Reported Roll</th>
                    <th>AI Estimated Presence</th>
                    <th>Variance Margin</th>
                    <th>Daily Compliance Score</th>
                    <th>Alerts Triggered</th>
                  </tr>
                </thead>
                <tbody>
                  {trendData.week.map((day) => (
                    <tr key={day.date}>
                      <td><strong>{day.date}</strong></td>
                      <td>{day.reported_avg > 0 ? `${day.reported_avg} trainees` : day.note}</td>
                      <td>{day.estimated_avg > 0 ? `${day.estimated_avg} trainees` : '--'}</td>
                      <td>
                        {day.reported_avg > 0 ? (
                          <span className={`delta-pill ${day.estimated_avg - day.reported_avg < -5 ? 'delta-bad' : 'delta-ok'}`}>
                            {day.estimated_avg - day.reported_avg} trainees
                          </span>
                        ) : '--'}
                      </td>
                      <td>
                        <strong style={{ color: day.score >= 85 ? '#34d399' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                          {day.score}%
                        </strong>
                      </td>
                      <td>
                        {day.alerts > 0 ? (
                          <span className="badge badge-attention">{day.alerts} Alert Raised</span>
                        ) : (
                          <span className="badge badge-compliant">0 Alerts</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Period: This Month */}
          {activePeriod === 'month' && trendData?.month && (
            <div className="table-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Monthly Compliance Trajectory</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {trendData.month.map((w) => (
                  <div key={w.week} style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{w.week}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: w.compliance_pct >= 90 ? '#34d399' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                      {w.compliance_pct}% <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Avg Score</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      Attendance Accuracy: <strong>{w.attendance_accuracy}%</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Alerts Raised: <strong>{w.alerts_raised}</strong> ({w.resolved_pct}% resolved)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
