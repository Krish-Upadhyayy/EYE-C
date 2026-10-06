import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Eye, 
  Clock, 
  Sliders, 
  BarChart3, 
  Activity, 
  Layers, 
  FileCheck2, 
  UserCheck, 
  Sparkles,
  Wifi,
  Plus,
  Camera,
  Video,
  GitCompare,
  Cpu
} from 'lucide-react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  userRole, 
  setUserRole, 
  pendingAlertsCount,
  onOpenScoringModal,
  onOpenSimulationModal,
  onOpenAddCentreModal,
  onOpenConnectCameraModal
}) {
  const tabs = [
    { id: 'dashboard', label: 'All Centres', icon: Building2 },
    { id: 'video-studio', label: 'CCTV Video & Snapshot Diff', icon: Video },
    { id: 'details', label: 'Centre Deep-Dive', icon: Eye },
    { id: 'evidence', label: 'Snapshots & YOLO Flags', icon: ShieldCheck, badge: pendingAlertsCount },
    { id: 'temporal-diff', label: 'Previous vs Current Diff', icon: GitCompare },
    { id: 'attendance', label: 'Submit Attendance', icon: FileCheck2 },
    { id: 'infrastructure', label: 'Infrastructure & Seating', icon: Layers },
    { id: 'trends', label: 'Historical Trends', icon: BarChart3 },
    { id: 'evaluation', label: 'AI Evaluation & Ground Truth', icon: Sparkles }
  ];

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="brand-section" onClick={() => setCurrentTab('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="eyec-logo-symbol">
            <svg viewBox="0 0 40 40" className="eyec-svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="#facc15" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
              <circle cx="20" cy="20" r="14" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
              <path d="M4 20C9 10 31 10 36 20C31 30 9 30 4 20Z" stroke="#facc15" strokeWidth="2.2" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="6" fill="#facc15" />
              <circle cx="20" cy="20" r="2.5" fill="#000000" />
              <circle cx="22" cy="18" r="1" fill="#ffffff" />
            </svg>
          </div>
          <div>
            <div className="brand-title">
              <span className="brand-name-eye">EYE</span><span className="brand-name-c">C</span>
              <span className="brand-tag-cctv">SYSTEM</span>
            </div>
            <div className="brand-subtitle">
              CCTV Compliance Monitoring System
            </div>
          </div>
        </div>

        <div className="header-controls">
          <div className="edge-status-pill">
            <span className="pulse-dot"></span>
            <span>Edge CV Active • 98.6% Bandwidth Saved</span>
          </div>

          <div className="role-selector-pill">
            <span className="role-label">Role:</span>
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="role-select"
            >
              <option value="Monitoring Authority">Monitoring Authority</option>
              <option value="Monitoring Officer">Monitoring Officer</option>
              <option value="Training Centre Operator">Centre Operator</option>
              <option value="System Administrator">System Administrator</option>
            </select>
          </div>

          <button 
            className="btn-primary"
            onClick={onOpenAddCentreModal}
            title="Register a new training centre into the compliance registry"
          >
            <Plus size={13} />
            <span>Add Centre</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={onOpenConnectCameraModal}
            title="Connect and provision a new CCTV camera to a centre"
          >
            <Camera size={13} />
            <span>Connect Camera</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={onOpenSimulationModal}
            title="Simulate edge camera snapshot capture and CV inference"
          >
            <Wifi size={13} />
            <span>Simulate Snap</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={onOpenScoringModal}
            title="Configure compliance scoring formula weights"
          >
            <Sliders size={13} />
            <span>Weights</span>
          </button>
        </div>
      </div>

      <nav className="nav-tabs-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="tab-badge">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
