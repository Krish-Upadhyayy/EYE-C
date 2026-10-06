import React, { useState } from 'react';
import { Wifi, X, Play, ShieldAlert, Cpu, HardDriveDownload, Check } from 'lucide-react';

export default function SimulationModal({ centres, onClose, onSimulate }) {
  const [selectedCentreId, setSelectedCentreId] = useState(centres[0]?.centre_id || '');
  const [simulatedCount, setSimulatedCount] = useState(18);
  const [simulateShortage, setSimulateShortage] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const selectedCentre = centres.find(c => c.centre_id === selectedCentreId) || centres[0];

  const handleRun = async (e) => {
    e.preventDefault();
    setIsRunning(true);
    try {
      const res = await onSimulate({
        centre_id: selectedCentreId,
        simulated_people_count: Number(simulatedCount),
        simulate_shortage: simulateShortage
      });
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={20} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Simulate Edge Camera Capture & CV Pipeline</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Simulates the edge computer extracting a periodic video frame (1-5 min), running local deep learning vision inference, evaluating compliance rules, and dispatching evidence metadata to the central dashboard.
        </p>

        {simulationResult ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Check size={18} />
              <span>Edge Inference Completed Successfully</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div>Snapshot ID: <strong>{simulationResult.snapshot?.snapshot_id}</strong></div>
              <div>Detected Presence: <strong>{simulationResult.snapshot?.people_count} trainees</strong></div>
              <div>Attendance Discrepancy: <strong style={{ color: simulationResult.snapshot?.discrepancy < 0 ? '#f87171' : '#34d399' }}>{simulationResult.snapshot?.discrepancy}</strong></div>
              <div>Bandwidth Saved: <strong>{simulationResult.snapshot?.bandwidth_saved_pct}%</strong> (Transmitted {simulationResult.snapshot?.bandwidth_transmitted_kb} KB)</div>
              {simulationResult.alert && (
                <div style={{ color: '#f87171', marginTop: '0.4rem', fontWeight: 600 }}>
                  ⚠️ Compliance Alert Raised: {simulationResult.alert.title} ({simulationResult.alert.severity})
                </div>
              )}
            </div>
            <button 
              className="btn-primary" 
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              View in Evidence Review Studio
            </button>
          </div>
        ) : (
          <form onSubmit={handleRun}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Target Centre Camera Node</label>
              <select 
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="form-input"
              >
                {centres.map(c => (
                  <option key={c.centre_id} value={c.centre_id}>
                    {c.name} ({c.centre_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                <span className="form-label">Simulate Physical Trainee Headcount in Frame</span>
                <span style={{ color: '#38bdf8' }}>{simulatedCount} Trainees</span>
              </div>
              <input 
                type="range"
                min="0"
                max="50"
                value={simulatedCount}
                onChange={(e) => setSimulatedCount(e.target.value)}
                className="weight-range"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                <span>0 (Empty Class)</span>
                <span>25 (Half Batch)</span>
                <span>50 (Full Capacity)</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px' }}>
              <input 
                type="checkbox"
                id="shortage-check"
                checked={simulateShortage}
                onChange={(e) => setSimulateShortage(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
              />
              <label htmlFor="shortage-check" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                Simulate Infrastructure Shortage / Workshop Bay Anomaly
              </label>
            </div>

            <button 
              type="submit" 
              className="btn-primary"
              disabled={isRunning}
              style={{ width: '100%', justifyContent: 'center', padding: '0.8rem' }}
            >
              <Play size={16} />
              <span>{isRunning ? 'Processing CV Pipeline at Edge...' : 'Execute Edge Frame Extraction & Inference'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
