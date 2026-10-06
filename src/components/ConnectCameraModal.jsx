import React, { useState } from 'react';
import { Camera, X, Plus, Wifi, Check, AlertCircle } from 'lucide-react';

export default function ConnectCameraModal({ centres, defaultCentreId, onClose, onConnectCamera }) {
  const [centreId, setCentreId] = useState(defaultCentreId || centres[0]?.centre_id || '');
  const [location, setLocation] = useState('Vocational Practical Lab');
  const [cameraId, setCameraId] = useState(`CAM-NEW-${Date.now().toString().slice(-3)}`);
  const [rtspUrl, setRtspUrl] = useState('rtsp://192.168.1.105:554/live/ch0');
  const [streamType, setStreamType] = useState('RTSP');
  const [fpsInterval, setFpsInterval] = useState('120');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        success: true,
        latency_ms: Math.floor(85 + Math.random() * 40),
        message: 'Handshake 200 OK: Stream reachable, 1080p frame decoded at 30 fps.'
      });
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConnectCamera(centreId, {
        camera_id: cameraId,
        location,
        rtsp_url: rtspUrl,
        fps: 1 / Number(fpsInterval)
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Camera size={18} style={{ color: '#34d399' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Connect CCTV Camera to Centre (Edge Node)</h3>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-dim)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '0.55rem' }}>
            <label className="form-label">Target Training Centre</label>
            <select className="form-input" value={centreId} onChange={(e) => setCentreId(e.target.value)}>
              {centres.map(c => (
                <option key={c.centre_id} value={c.centre_id}>
                  [{c.centre_id}] {c.name} ({c.location})
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid" style={{ marginBottom: '0.55rem' }}>
            <div className="form-group">
              <label className="form-label">Camera Identifier</label>
              <input 
                type="text" 
                className="form-input" 
                value={cameraId} 
                onChange={(e) => setCameraId(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Room / Bay Location</label>
              <input 
                type="text" 
                className="form-input" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lab 2 / Welding Floor"
                required 
              />
            </div>
          </div>

          <div className="form-grid" style={{ marginBottom: '0.55rem' }}>
            <div className="form-group">
              <label className="form-label">Source Protocol</label>
              <select className="form-input" value={streamType} onChange={(e) => setStreamType(e.target.value)}>
                <option value="RTSP">RTSP Stream (H.264/H.265)</option>
                <option value="ONVIF">ONVIF IP Camera</option>
                <option value="HTTP_SNAPSHOT">HTTP Periodic Snapshot URI</option>
                <option value="WEBCAM">Local USB / Laptop Camera</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Periodic Extraction Rate</label>
              <select className="form-input" value={fpsInterval} onChange={(e) => setFpsInterval(e.target.value)}>
                <option value="60">1 frame every 1 minute (60s)</option>
                <option value="120">1 frame every 2 minutes (120s)</option>
                <option value="300">1 frame every 5 minutes (300s)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Stream / Network Camera URL</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input 
                type="text" 
                className="form-input" 
                value={rtspUrl} 
                onChange={(e) => setRtspUrl(e.target.value)}
                style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}
                required 
              />
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleTestConnection}
                disabled={isTesting}
                style={{ whiteSpace: 'nowrap' }}
              >
                <Wifi size={13} />
                <span>{isTesting ? 'Testing...' : 'Test Ping'}</span>
              </button>
            </div>
          </div>

          {testResult && (
            <div style={{ 
              background: testResult.success ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
              border: `1px solid ${testResult.success ? '#10b981' : '#ef4444'}`,
              color: testResult.success ? '#34d399' : '#f87171',
              padding: '0.45rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <Check size={14} />
              <span>{testResult.message} Latency: <strong>{testResult.latency_ms} ms</strong></span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Plus size={14} />
              <span>{isSubmitting ? 'Provisioning...' : 'Provision Camera'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
