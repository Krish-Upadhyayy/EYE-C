import React, { useState } from 'react';
import { 
  Activity, 
  Camera, 
  Cpu, 
  Wifi, 
  WifiOff, 
  HardDriveDownload, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw,
  Plus,
  RotateCcw,
  Zap
} from 'lucide-react';

export default function EdgeHealthView({ 
  centres, 
  systemHealth, 
  onRefreshHealth,
  onOpenConnectCameraModal 
}) {
  const [actionFeedback, setActionFeedback] = useState(null);
  const [operatingId, setOperatingId] = useState(null);

  const cameras = centres.flatMap(c => c.cameras.map(cam => ({ ...cam, centre_name: c.name, centre_id: c.centre_id })));
  const edgeDevices = systemHealth?.edge_devices || [];

  const handlePingCamera = async (camId) => {
    setOperatingId(`ping-${camId}`);
    try {
      const res = await fetch(`/api/cameras/${camId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping' })
      });
      const data = await res.json();
      setActionFeedback({
        type: 'success',
        text: `Camera ${camId} pinged successfully: Latency ${data.camera?.latency_ms} ms.`
      });
      onRefreshHealth();
    } catch (err) {
      console.error(err);
    } finally {
      setOperatingId(null);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const handleToggleCameraStatus = async (camId, currentStatus) => {
    setOperatingId(`toggle-${camId}`);
    const nextStatus = currentStatus === 'Online' ? 'Offline' : 'Online';
    try {
      await fetch(`/api/cameras/${camId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      setActionFeedback({
        type: 'info',
        text: `Camera ${camId} marked ${nextStatus}. System watchdog updated.`
      });
      onRefreshHealth();
    } catch (err) {
      console.error(err);
    } finally {
      setOperatingId(null);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const handleSyncBuffer = async (deviceId) => {
    setOperatingId(`sync-${deviceId}`);
    try {
      const res = await fetch(`/api/edge/${deviceId}/sync`, { method: 'POST' });
      const data = await res.json();
      setActionFeedback({
        type: 'success',
        text: `Edge device ${deviceId}: ${data.message}. All frames synchronized.`
      });
      onRefreshHealth();
    } catch (err) {
      console.error(err);
    } finally {
      setOperatingId(null);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  const handleRebootDevice = async (deviceId) => {
    setOperatingId(`reboot-${deviceId}`);
    try {
      await fetch(`/api/edge/${deviceId}/reboot`, { method: 'POST' });
      setActionFeedback({
        type: 'success',
        text: `Edge node ${deviceId} rebooted and re-initialized.`
      });
      onRefreshHealth();
    } catch (err) {
      console.error(err);
    } finally {
      setOperatingId(null);
      setTimeout(() => setActionFeedback(null), 3500);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          <Activity size={18} style={{ color: '#38bdf8' }} />
          <span>System & Edge Camera Health (PRD Section 17 & 18)</span>
        </div>

        <div className="section-actions">
          <button className="btn-primary" onClick={onOpenConnectCameraModal}>
            <Plus size={13} />
            <span>Connect New Camera</span>
          </button>

          <button className="btn-secondary" onClick={onRefreshHealth}>
            <RefreshCw size={13} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div style={{
          background: actionFeedback.type === 'success' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(37, 99, 235, 0.15)',
          border: `1px solid ${actionFeedback.type === 'success' ? '#10b981' : '#3b82f6'}`,
          color: actionFeedback.type === 'success' ? '#34d399' : '#93c5fd',
          padding: '0.45rem 0.65rem',
          borderRadius: '4px',
          fontSize: '0.74rem',
          marginBottom: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <CheckCircle2 size={14} />
          <span>{actionFeedback.text}</span>
        </div>
      )}

      {/* Health Overview Banner */}
      <div className="stats-banner" style={{ marginBottom: '0.65rem' }}>
        <div className="stat-card">
          <div>
            <div className="stat-label">CCTV Uptime & Health</div>
            <div className="stat-value" style={{ color: '#34d399' }}>
              {systemHealth?.cameras?.uptime_pct || 90}%
            </div>
            <div className="stat-subtext">
              {systemHealth?.cameras?.online} Online • {systemHealth?.cameras?.degraded} Degraded • {systemHealth?.cameras?.offline} Offline
            </div>
          </div>
          <div className="stat-icon" style={{ color: '#10b981' }}>
            <Camera size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Edge Units Deployed</div>
            <div className="stat-value">
              {edgeDevices.length} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nodes</span>
            </div>
            <div className="stat-subtext">Running Local YOLO / CV Inference</div>
          </div>
          <div className="stat-icon" style={{ color: '#38bdf8' }}>
            <Cpu size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Offline Queued Frames</div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>
              {edgeDevices.reduce((sum, d) => sum + (d.buffer_queue_count || 0), 0)}
            </div>
            <div className="stat-subtext">Buffered Locally During Outages</div>
          </div>
          <div className="stat-icon" style={{ color: '#fbbf24' }}>
            <Wifi size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Bandwidth Conserved</div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>
              {systemHealth?.total_bandwidth_saved_gb || '2.74'} GB
            </div>
            <div className="stat-subtext">Periodic Snapshots vs Stream</div>
          </div>
          <div className="stat-icon" style={{ color: '#38bdf8' }}>
            <HardDriveDownload size={18} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Average Inference Latency</div>
            <div className="stat-value" style={{ color: '#34d399' }}>
              {systemHealth?.avg_inference_latency_ms || 154} <span style={{ fontSize: '0.75rem' }}>ms</span>
            </div>
            <div className="stat-subtext">TensorRT Jetson Performance</div>
          </div>
          <div className="stat-icon" style={{ color: '#34d399' }}>
            <Zap size={18} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '0.65rem' }}>
        {/* Camera Status & Interactive Control Grid */}
        <div className="table-card">
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Surveillance Camera Telemetry & Operations</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{cameras.length} Total Cameras Connected</span>
          </div>

          <table className="compliance-table">
            <thead>
              <tr>
                <th>Camera ID</th>
                <th>Centre & Location</th>
                <th>Latency</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map((cam) => (
                <tr key={cam.camera_id}>
                  <td><strong style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{cam.camera_id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{cam.location}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{cam.centre_name}</div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>
                    {cam.latency_ms > 0 ? `${cam.latency_ms} ms` : 'Disconnected'}
                  </td>
                  <td>
                    <span className={`badge ${cam.status === 'Online' ? 'badge-compliant' : cam.status === 'Degraded' ? 'badge-attention' : 'badge-critical'}`}>
                      {cam.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                        onClick={() => handlePingCamera(cam.camera_id)}
                        disabled={operatingId === `ping-${cam.camera_id}`}
                        title="Ping camera stream and check latency"
                      >
                        Ping
                      </button>

                      <button 
                        className={cam.status === 'Online' ? 'btn-danger' : 'btn-success'} 
                        style={{ padding: '2px 6px', fontSize: '0.68rem' }}
                        onClick={() => handleToggleCameraStatus(cam.camera_id, cam.status)}
                        disabled={operatingId === `toggle-${cam.camera_id}`}
                        title="Toggle camera online / offline to simulate fault handling"
                      >
                        {cam.status === 'Online' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edge Devices Hardware Status & Interactive Controls */}
        <div className="table-card">
          <div style={{ padding: '0.45rem 0.65rem', background: 'var(--bg-table-header)', borderBottom: '1px solid var(--border-subtle)', fontWeight: 700, fontSize: '0.75rem' }}>
            Edge Compute Node Health & Flash Sync Queue
          </div>

          <div style={{ padding: '0.55rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {edgeDevices.map((dev) => (
              <div key={dev.device_id} style={{ background: 'var(--bg-secondary)', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.78rem' }}>{dev.device_id}</strong>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{dev.centre_name} ({dev.model})</div>
                  </div>
                  <span className={`badge ${dev.status === 'Active' ? 'badge-compliant' : 'badge-attention'}`}>
                    {dev.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.35rem', marginBottom: '0.45rem' }}>
                  <div>CPU: <strong>{dev.cpu_usage_pct}%</strong></div>
                  <div>Temp: <strong>{dev.temperature_c}°C</strong></div>
                  <div style={{ color: dev.buffer_queue_count > 0 ? '#fbbf24' : '#34d399' }}>
                    Buffer: <strong>{dev.buffer_queue_count} frames</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {dev.buffer_queue_count > 0 && (
                    <button 
                      className="btn-success"
                      style={{ padding: '2px 7px', fontSize: '0.68rem', flex: 1 }}
                      onClick={() => handleSyncBuffer(dev.device_id)}
                      disabled={operatingId === `sync-${dev.device_id}`}
                      title="Flush offline queue and sync frames to cloud"
                    >
                      <HardDriveDownload size={11} />
                      <span>Sync {dev.buffer_queue_count} Frames</span>
                    </button>
                  )}

                  <button 
                    className="btn-secondary"
                    style={{ padding: '2px 7px', fontSize: '0.68rem' }}
                    onClick={() => handleRebootDevice(dev.device_id)}
                    disabled={operatingId === `reboot-${dev.device_id}`}
                    title="Simulate Jetson node reboot"
                  >
                    <RotateCcw size={11} />
                    <span>Reboot Node</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
