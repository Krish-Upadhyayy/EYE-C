import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CentreDashboard from './components/CentreDashboard';
import CentreDetail from './components/CentreDetail';
import EvidenceReview from './components/EvidenceReview';
import TemporalDiffView from './components/TemporalDiffView';
import AttendanceView from './components/AttendanceView';
import InfrastructureView from './components/InfrastructureView';
import TrendsView from './components/TrendsView';
import AiEvaluationView from './components/AiEvaluationView';
import ScoringModal from './components/ScoringModal';
import SimulationModal from './components/SimulationModal';
import AddCentreModal from './components/AddCentreModal';
import ConnectCameraModal from './components/ConnectCameraModal';
import VideoExtractionStudio from './components/VideoExtractionStudio';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('Monitoring Officer');
  const [selectedCentreId, setSelectedCentreId] = useState('');

  // Application Data States
  const [centres, setCentres] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [infrastructureItems, setInfrastructureItems] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [scoringWeights, setScoringWeights] = useState({
    attendance: 35,
    infrastructure: 25,
    seating: 15,
    workshop: 15,
    historical: 10
  });

  // Modals
  const [isScoringModalOpen, setIsScoringModalOpen] = useState(false);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [isAddCentreModalOpen, setIsAddCentreModalOpen] = useState(false);
  const [isConnectCameraModalOpen, setIsConnectCameraModalOpen] = useState(false);
  const [targetConnectCentreId, setTargetConnectCentreId] = useState('');
  const [loading, setLoading] = useState(true);

  // Initial Load with robust Netlify / offline fallback
  const fetchData = async () => {
    try {
      const safeJson = async (p, defaultVal = []) => {
        try {
          const res = await p;
          if (!res || !res.ok) return defaultVal;
          const ct = res.headers.get('content-type') || '';
          if (!ct.includes('application/json')) return defaultVal;
          return await res.json();
        } catch (_) {
          return defaultVal;
        }
      };

      const [centresData, alertsData, healthData, scoringData, snapshotsData, infraData, attData] = await Promise.all([
        safeJson(fetch('/api/centres'), []),
        safeJson(fetch('/api/alerts'), []),
        safeJson(fetch('/api/system/health'), null),
        safeJson(fetch('/api/config/scoring'), { attendance: 35, infrastructure: 25, seating: 15, workshop: 15, historical: 10 }),
        safeJson(fetch('/api/snapshots'), []),
        safeJson(fetch('/api/infrastructure'), []),
        safeJson(fetch('/api/attendance'), [])
      ]);

      setCentres(centresData || []);
      setAlerts(alertsData || []);
      setSystemHealth(healthData || null);
      setScoringWeights(scoringData);
      setSnapshots(snapshotsData || []);
      setInfrastructureItems(infraData || []);
      setAttendanceRecords(attData || []);

      if (centresData && centresData.length > 0) {
        setSelectedCentreId(prev => prev || centresData[0].centre_id);
        setTargetConnectCentreId(prev => prev || centresData[0].centre_id);
      }

      setLoading(false);
    } catch (err) {
      console.warn('Network API unavailable, initialized in standalone mode:', err);
      setCentres([]);
      setAlerts([]);
      setSnapshots([]);
      setInfrastructureItems([]);
      setAttendanceRecords([]);
      setScoringWeights({ attendance: 35, infrastructure: 25, seating: 15, workshop: 15, historical: 10 });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Action handlers
  const handleSelectCentre = (id) => {
    setSelectedCentreId(id);
    setCurrentTab('details');
  };

  const handleReviewAlert = (centreId) => {
    setSelectedCentreId(centreId);
    setCurrentTab('evidence');
  };

  const handleViewTemporalDiff = (centreId) => {
    setSelectedCentreId(centreId);
    setCurrentTab('temporal-diff');
  };

  const handleOpenAttendanceModal = (centreId) => {
    setSelectedCentreId(centreId);
    setCurrentTab('attendance');
  };

  const handleOpenConnectCamera = (centreId) => {
    setTargetConnectCentreId(centreId || selectedCentreId || (centres[0]?.centre_id || ''));
    setIsConnectCameraModalOpen(true);
  };

  const handleAddCentre = async (payload) => {
    const res = await fetch('/api/centres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    await fetchData();
    if (data.centre) {
      setSelectedCentreId(data.centre.centre_id);
      setCurrentTab('details');
    }
    return data;
  };

  const handleConnectCamera = async (centreId, payload) => {
    const res = await fetch(`/api/centres/${centreId}/cameras`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    await fetchData();
    return data;
  };

  const handleVerifyAlert = async (alertId, payload) => {
    const res = await fetch(`/api/alerts/${alertId}/verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    await fetchData();
    return data;
  };

  const [selectedSnapshotIdForReview, setSelectedSnapshotIdForReview] = useState('');

  const handleVerifySnapshot = async (snapshotId, payload) => {
    const res = await fetch(`/api/snapshots/${snapshotId}/verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    await fetchData();
    return data;
  };

  const handleNavigateToSnapshotReview = (snapshotId) => {
    if (snapshotId) setSelectedSnapshotIdForReview(snapshotId);
    setCurrentTab('evidence');
  };

  const handleAddInfrastructure = async (centreId, payload) => {
    const res = await fetch(`/api/centres/${centreId}/infrastructure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    await fetchData();
    return data;
  };

  const handleSubmitAttendance = async (centreId, payload) => {
    const res = await fetch(`/api/centres/${centreId}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    await fetchData();
    return data;
  };

  const handleSimulateSnapshot = async (payload) => {
    const res = await fetch('/api/simulation/trigger-snapshot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.snapshot) {
      setSnapshots(prev => [data.snapshot, ...prev]);
    }
    await fetchData();
    return data;
  };

  const handleSaveWeights = async (newWeights) => {
    const res = await fetch('/api/config/scoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWeights)
    });
    const data = await res.json();
    setScoringWeights(data.weights);
    await fetchData();
  };

  const pendingAlertsCount = alerts.filter(a => a.status === 'Pending Review').length;

  return (
    <div>
      <Header 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={userRole}
        setUserRole={setUserRole}
        pendingAlertsCount={pendingAlertsCount}
        onOpenScoringModal={() => setIsScoringModalOpen(true)}
        onOpenSimulationModal={() => setIsSimulationModalOpen(true)}
        onOpenAddCentreModal={() => setIsAddCentreModalOpen(true)}
        onOpenConnectCameraModal={() => handleOpenConnectCamera(selectedCentreId)}
      />

      <main className="app-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <h3>Connecting to Gov Compliance Intelligence Core...</h3>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Synchronizing edge nodes and active camera feeds</p>
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <CentreDashboard 
                centres={centres}
                onSelectCentre={handleSelectCentre}
                onReviewAlert={handleReviewAlert}
                onOpenAttendanceModal={handleOpenAttendanceModal}
                onOpenAddCentreModal={() => setIsAddCentreModalOpen(true)}
                onOpenConnectCameraModal={handleOpenConnectCamera}
                onViewTemporalDiff={handleViewTemporalDiff}
                systemHealth={systemHealth}
              />
            )}

            {currentTab === 'video-studio' && (
              <ErrorBoundary fallbackTitle="CCTV Video Studio Recovered">
                <VideoExtractionStudio 
                  centres={centres}
                  onRefreshData={fetchData}
                  onOpenAddCentreModal={() => setIsAddCentreModalOpen(true)}
                  onNavigateToSnapshotReview={handleNavigateToSnapshotReview}
                />
              </ErrorBoundary>
            )}

            {currentTab === 'details' && (
              <CentreDetail 
                centreId={selectedCentreId}
                centres={centres}
                onBack={() => setCurrentTab('dashboard')}
                onReviewAlert={handleReviewAlert}
                onOpenAttendanceModal={handleOpenAttendanceModal}
                onOpenConnectCameraModal={handleOpenConnectCamera}
                onViewTemporalDiff={handleViewTemporalDiff}
              />
            )}

            {currentTab === 'evidence' && (
              <EvidenceReview 
                alerts={alerts}
                snapshots={snapshots}
                centres={centres}
                onVerifyAlert={handleVerifyAlert}
                onVerifySnapshot={handleVerifySnapshot}
                initialSnapshotId={selectedSnapshotIdForReview}
                userRole={userRole}
                onRefreshData={fetchData}
                onNavigateToTab={setCurrentTab}
              />
            )}

            {currentTab === 'temporal-diff' && (
              <TemporalDiffView 
                centres={centres}
              />
            )}

            {currentTab === 'attendance' && (
              <AttendanceView 
                centres={centres}
                attendanceRecords={attendanceRecords}
                onSubmitAttendance={handleSubmitAttendance}
                preselectedCentreId={selectedCentreId}
              />
            )}

            {currentTab === 'infrastructure' && (
              <InfrastructureView 
                centres={centres}
                infrastructureItems={infrastructureItems}
                snapshots={snapshots}
                onAddInfrastructure={handleAddInfrastructure}
                onRefreshData={fetchData}
              />
            )}

            {currentTab === 'trends' && (
              <TrendsView 
                centres={centres}
              />
            )}

            {currentTab === 'evaluation' && (
              <AiEvaluationView />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {isScoringModalOpen && (
        <ScoringModal 
          weights={scoringWeights}
          onClose={() => setIsScoringModalOpen(false)}
          onSave={handleSaveWeights}
        />
      )}

      {isSimulationModalOpen && (
        <SimulationModal 
          centres={centres}
          onClose={() => setIsSimulationModalOpen(false)}
          onSimulate={handleSimulateSnapshot}
        />
      )}

      {isAddCentreModalOpen && (
        <AddCentreModal 
          onClose={() => setIsAddCentreModalOpen(false)}
          onAddCentre={handleAddCentre}
        />
      )}

      {isConnectCameraModalOpen && (
        <ConnectCameraModal 
          centres={centres}
          defaultCentreId={targetConnectCentreId}
          onClose={() => setIsConnectCameraModalOpen(false)}
          onConnectCamera={handleConnectCamera}
        />
      )}
    </div>
  );
}
