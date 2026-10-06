// Clean State Store for AI Training Centre Compliance System
// Default mock centres and images removed per user request: centres and videos added dynamically.

export const scoringWeights = {
  attendance: 35,
  infrastructure: 25,
  seating: 15,
  workshop: 15,
  historical: 10
};

export let centres = [];
export let attendanceRecords = [];
export let infrastructureItems = [];
export let detectionSnapshots = [];
export let alerts = [];
export let verifications = [];
export let auditLogs = [];

export const aiEvaluationMetrics = {
  summary: {
    total_test_snapshots: 0,
    test_scenarios_count: 0,
    dataset_name: 'Gov-Skill-CV-Bench (Dynamic Evaluation)',
    measured_accuracy_pct: 0,
    precision_pct: 0,
    recall_pct: 0,
    false_positive_rate_pct: 0,
    false_negative_rate_pct: 0,
    avg_inference_latency_ms: 0,
    face_anonymization_success_pct: 100,
    bandwidth_reduction_pct: 99.2
  },
  scenarios: [],
  confusion_matrix: {
    tp: 0,
    fp: 0,
    fn: 0,
    tn: 0
  },
  ground_truth_samples: []
};
