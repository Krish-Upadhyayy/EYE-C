import React, { useState } from 'react';
import { Building2, X, Plus, Check } from 'lucide-react';

export default function AddCentreModal({ onClose, onAddCentre }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [scheme, setScheme] = useState('PMKVY 4.0 - IT & Electronics');
  const [capacity, setCapacity] = useState(40);
  const [workshop, setWorkshop] = useState('General Practical & Electronics Bay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await onAddCentre({
        name,
        location,
        state,
        scheme,
        approved_seating_capacity: Number(capacity),
        workshop_requirement: workshop
      });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to add training centre. Please check backend API connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Building2 size={18} style={{ color: '#38bdf8' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Register New Training Centre (FR-Registry)</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)' }}>
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.6rem 0.8rem',
            borderRadius: '6px',
            fontSize: '0.78rem',
            marginBottom: '0.75rem',
            lineHeight: 1.4
          }}>
            <strong>Connection Error:</strong> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '0.55rem' }}>
            <label className="form-label">Training Centre Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Kaushal Vikas Kendra - Central Hub"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="form-grid" style={{ marginBottom: '0.55rem' }}>
            <div className="form-group">
              <label className="form-label">City / Location</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Nagpur"
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">State / UT</label>
              <select className="form-input" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.55rem' }}>
            <label className="form-label">Government Accreditation Scheme</label>
            <select className="form-input" value={scheme} onChange={(e) => setScheme(e.target.value)}>
              <option value="PMKVY 4.0 - IT & Electronics">PMKVY 4.0 - IT & Electronics</option>
              <option value="DDU-GKY - CNC Machining & Automation">DDU-GKY - CNC Machining & Automation</option>
              <option value="Craftsmen Training Scheme (CTS)">Craftsmen Training Scheme (CTS)</option>
              <option value="SANKALP - Skill Training">SANKALP - Skill Training</option>
              <option value="State Skill Development Mission (SSDM)">State Skill Development Mission (SSDM)</option>
            </select>
          </div>

          <div className="form-grid" style={{ marginBottom: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Approved Seating Capacity (FR-08)</label>
              <input 
                type="number" 
                className="form-input" 
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)}
                min="5" 
                max="200" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Workshop Specification (FR-09)</label>
              <input 
                type="text" 
                className="form-input" 
                value={workshop} 
                onChange={(e) => setWorkshop(e.target.value)}
                placeholder="e.g. Electrical & Soldering Lab"
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Plus size={14} />
              <span>{isSubmitting ? 'Registering...' : 'Register Centre'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
