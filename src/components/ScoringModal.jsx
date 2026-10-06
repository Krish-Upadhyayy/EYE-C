import React, { useState } from 'react';
import { Sliders, X, Check, RotateCcw } from 'lucide-react';

export default function ScoringModal({ weights, onClose, onSave }) {
  const [localWeights, setLocalWeights] = useState({ ...weights });

  const total = 
    Number(localWeights.attendance) + 
    Number(localWeights.infrastructure) + 
    Number(localWeights.seating) + 
    Number(localWeights.workshop) + 
    Number(localWeights.historical);

  const handleChange = (key, val) => {
    setLocalWeights(prev => ({
      ...prev,
      [key]: Number(val)
    }));
  };

  const handleReset = () => {
    setLocalWeights({
      attendance: 35,
      infrastructure: 25,
      seating: 15,
      workshop: 15,
      historical: 10
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localWeights);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Configurable Compliance Scoring Formula (PRD Section 20)</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Per PRD Section 20: Provide a 0–100 centre compliance score using configurable weights for attendance, infrastructure, seating, workshop, and historical alerts. The exact weighting is configurable rather than hard-coded.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Attendance Weight */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Attendance Presence Accuracy</span>
              <strong style={{ color: '#38bdf8' }}>{localWeights.attendance}%</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="60" 
              value={localWeights.attendance}
              onChange={(e) => handleChange('attendance', e.target.value)}
              className="weight-range"
            />
          </div>

          {/* Infrastructure Weight */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Approved Infrastructure Inventory</span>
              <strong style={{ color: '#38bdf8' }}>{localWeights.infrastructure}%</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={localWeights.infrastructure}
              onChange={(e) => handleChange('infrastructure', e.target.value)}
              className="weight-range"
            />
          </div>

          {/* Seating Weight */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Seating Capacity Verification</span>
              <strong style={{ color: '#38bdf8' }}>{localWeights.seating}%</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={localWeights.seating}
              onChange={(e) => handleChange('seating', e.target.value)}
              className="weight-range"
            />
          </div>

          {/* Workshop Weight */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Workshop Area & Machine Availability</span>
              <strong style={{ color: '#38bdf8' }}>{localWeights.workshop}%</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={localWeights.workshop}
              onChange={(e) => handleChange('workshop', e.target.value)}
              className="weight-range"
            />
          </div>

          {/* Historical Alert Penalty */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Historical Alerts & Resolution SLAs</span>
              <strong style={{ color: '#38bdf8' }}>{localWeights.historical}%</strong>
            </div>
            <input 
              type="range" 
              min="0" 
              max="30" 
              value={localWeights.historical}
              onChange={(e) => handleChange('historical', e.target.value)}
              className="weight-range"
            />
          </div>

          {/* Total Sum Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)', margin: '1rem 0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Total Weight Allocation:</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: total === 100 ? '#34d399' : '#fbbf24' }}>
              {total}% {total === 100 ? '✓ Balanced' : '(Normalized to 100%)'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleReset}
            >
              <RotateCcw size={14} />
              <span>Reset Defaults</span>
            </button>

            <button 
              type="submit" 
              className="btn-primary"
            >
              <Check size={16} />
              <span>Apply Weights & Recalculate Scores</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
