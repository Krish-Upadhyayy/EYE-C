import React, { useState } from 'react';
import { X, Layers, Plus, CheckCircle2, AlertTriangle, Monitor, Wrench, Armchair, Shield } from 'lucide-react';

export default function AddInfrastructureModal({
  centres = [],
  defaultCentreId,
  onClose,
  onAddInfrastructure
}) {
  const [centreId, setCentreId] = useState(defaultCentreId || centres[0]?.centre_id || 'CTR-01');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('IT & Computing');
  const [approvedQuantity, setApprovedQuantity] = useState(20);
  const [locationBay, setLocationBay] = useState('Lab Bay A - Room 101');
  const [requiredCondition, setRequiredCondition] = useState('Operational & Intact');
  const [serialNo, setSerialNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [
    { name: 'Desktop Computer Workstations', category: 'IT & Computing', qty: 25, loc: 'Room 101 - IT Lab' },
    { name: 'CNC Milling Machine Center', category: 'Workshop Machinery', qty: 4, loc: 'Workshop Bay 2' },
    { name: 'Student Sanctioned Desks & Chairs', category: 'Classroom Furniture / Seating', qty: 30, loc: 'Lecture Hall A' },
    { name: 'Welding Simulator Unit', category: 'Workshop Machinery', qty: 2, loc: 'Welding Bay 1' },
    { name: 'Fire Extinguisher & First-Aid Station', category: 'Safety & Tools', qty: 6, loc: 'All Corridors' },
    { name: 'Gigabit Switch & Server Rack', category: 'IT & Computing', qty: 2, loc: 'Server Room' }
  ];

  const handleApplyPreset = (preset) => {
    setName(preset.name);
    setCategory(preset.category);
    setApprovedQuantity(preset.qty);
    setLocationBay(preset.loc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddInfrastructure(centreId, {
        name,
        category,
        approved_quantity: Number(approvedQuantity),
        location_bay: locationBay,
        required_condition: requiredCondition,
        serial_no: serialNo
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} style={{ color: '#facc15' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
              Register Physical Infrastructure
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Quick Presets */}
          <div>
            <span style={{ fontSize: '0.7rem', color: '#a1a1aa', display: 'block', marginBottom: '0.35rem' }}>
              Quick Template Presets:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="btn-secondary"
                  style={{ padding: '2px 7px', fontSize: '0.64rem', borderRadius: '4px' }}
                >
                  {p.name.split(' ')[0]} ({p.qty})
                </button>
              ))}
            </div>
          </div>

          {/* Centre Select */}
          {centres.length > 0 && (
            <div>
              <label style={{ fontSize: '0.7rem', color: '#d4d4d8', display: 'block', marginBottom: '0.25rem' }}>
                Assigned Training Centre:
              </label>
              <select
                value={centreId}
                onChange={(e) => setCentreId(e.target.value)}
                className="filter-select"
                style={{ width: '100%', padding: '5px 8px', fontSize: '0.75rem' }}
              >
                {centres.map(c => (
                  <option key={c.centre_id} value={c.centre_id}>
                    [{c.centre_id}] {c.name} ({c.location})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Equipment Name */}
          <div>
            <label style={{ fontSize: '0.7rem', color: '#d4d4d8', display: 'block', marginBottom: '0.25rem' }}>
              Equipment / Asset Name: *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Desktop Computer Workstations"
              className="filter-select"
              style={{ width: '100%', padding: '5px 8px', fontSize: '0.75rem' }}
            />
          </div>

          {/* Category & Quantity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#d4d4d8', display: 'block', marginBottom: '0.25rem' }}>
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="filter-select"
                style={{ width: '100%', padding: '5px 8px', fontSize: '0.75rem' }}
              >
                <option value="IT & Computing">IT & Computing (Desktops, Servers)</option>
                <option value="Workshop Machinery">Workshop Machinery (CNC, Lathes)</option>
                <option value="Classroom Furniture / Seating">Classroom Furniture / Seating</option>
                <option value="Safety & Tools">Safety & Tools (Extinguishers, Kits)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: '#d4d4d8', display: 'block', marginBottom: '0.25rem' }}>
                Approved Quantity: *
              </label>
              <input
                type="number"
                required
                min="1"
                max="500"
                value={approvedQuantity}
                onChange={(e) => setApprovedQuantity(e.target.value)}
                className="filter-select"
                style={{ width: '100%', padding: '5px 8px', fontSize: '0.75rem', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Location & Benchmark Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.7rem', color: '#d4d4d8', display: 'block', marginBottom: '0.25rem' }}>
                Location Bay / Room:
              </label>
              <input
                type="text"
                value={locationBay}
                onChange={(e) => setLocationBay(e.target.value)}
                placeholder="e.g. Lab Bay A - Room 101"
                className="filter-select"
                style={{ width: '100%', padding: '5px 8px', fontSize: '0.75rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: '#d4d4d8', display: 'block', marginBottom: '0.25rem' }}>
                Required Condition Benchmark:
              </label>
              <input
                type="text"
                value={requiredCondition}
                onChange={(e) => setRequiredCondition(e.target.value)}
                placeholder="Operational & Intact"
                className="filter-select"
                style={{ width: '100%', padding: '5px 8px', fontSize: '0.75rem' }}
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ padding: '5px 12px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '5px 14px' }}>
              <Plus size={13} />
              <span>{isSubmitting ? 'Registering...' : 'Register Infrastructure Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
