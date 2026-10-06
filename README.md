# 👁️ EYEC — CCTV Compliance Monitoring & Automated Headcount Audit System

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Node.js-Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-FACC15?style=for-the-badge&logoColor=black)](LICENSE)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

> **EYEC (Eye-C)** is an enterprise-grade AI CCTV Compliance Monitoring and Automated Headcount Auditing platform engineered for vocational training schemes (PMKVY 4.0, DGT, NSDC). It automates attendance verification, infrastructure discrepancy detection, and temporal absent trainee tracking via high-accuracy computer vision and edge-resilient telemetry.

---

## ⚡ Key Capabilities

- 🎯 **High-Accuracy Edge CV & YOLOv8 Headcount Detection**:
  - Direct canvas pixel analysis combining Sobel edge gradients (`grad > 20`), luminance variance, and chroma contrast to detect human silhouettes.
  - Spatial Non-Maximum Suppression (NMS) prevents double-counting by clustering adjacent head-torso regions.
  - Dynamic adaptive baseline thresholding (`Strict`, `Balanced`, `High Sensitivity`).
  - No synthetic floor clamp: accurately detects 0 trainees in empty rooms, 1 in solo sessions, or 30+ in full labs.

- 🛠️ **Real-Time Calibration Toolbar**:
  - Live verified headcount badge on CCTV video streams.
  - Direct numeric headcount input field for zero-latency manual calibration.
  - One-click fine-tuning buttons (`[ - 1 ]` / `[ + 1 ]`) and `[ Reset Auto ]`.
  - Toggleable green SVG bounding box overlay with trainee confidence ratings.

- 💎 **100% Raw Optical Sensor Clarity**:
  - Full-resolution unmasked sensor frame capture (`0.95` quality) directly from video feed.
  - Removed all privacy face blur filters to ensure pinpoint optical delineation and reliable attendance audits.

- 🛡️ **Statutory 7-Day Storage Retention & Automated Purge**:
  - Built-in 168-hour data lifecycle management.
  - Autonomous background daemon scans every 15 minutes and purges all snapshots and evidence frames older than 7 days.
  - Audit logs record each automated purge cycle (`AUD-PURGE`).

- ⏱️ **Temporal Snapshot Differential Engine**:
  - Compares consecutive video frames (Frame A vs. Frame B) to identify sudden attendance drops.
  - Pinpoints missing trainees, timestamps, and triggers severity-graded attendance alerts.

- 🏛️ **Dynamic Centre & Multi-Camera Provisioning**:
  - Add and configure training centres with approved seating limits and trade workshops.
  - Connect RTSP/CCTV cameras and simulate NVIDIA Jetson Orin Nano edge buffer synchronization.

- 📋 **Evidence Review & Multi-Role Governance**:
  - Human-in-the-loop review workflow for Monitoring Officers and Centre Administrators.
  - Full audit logging, manual decision overrides, and compliance verification receipts.

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    subgraph Edge Layer [Training Centre Edge Node - Jetson Orin Nano]
        CAM[CCTV Video Feed / RTSP] --> CAP[Raw Frame Extractor]
        CAP --> CV[Edge CV & YOLOv8 Pipeline]
        CV --> NMS[Spatial NMS & Silhouette Clustering]
        NMS --> OSD[Live OSD & Verified Headcount]
    end

    subgraph Server Layer [EYEC Express API Backend]
        OSD --> API[/api/snapshots/extract]
        API --> DIFF[Temporal Frame-Diff Engine]
        DIFF --> ALERT[Attendance Mismatch Alerts]
        PURGE[Statutory 7-Day Purge Daemon] -->|Every 15 min| CLEAN[(Snapshot Storage)]
    end

    subgraph Client Layer [EYEC Web Interface]
        API --> UI[EYEC Operations Dashboard]
        UI --> CALIB[Live Calibration Toolbar]
        UI --> EVID[Evidence Review Studio]
        UI --> AUDIT[Audit Trail Ledger]
    end
```

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Lucide React Icons
- **Styling**: Vanilla CSS Design System (Cyber Yellow `#facc15`, Pitch Black `#070709`, Dark Glassmorphism)
- **Backend API**: Node.js, Express, RESTful JSON API
- **Deployment**: Netlify Static Hosting, Docker, Node.js Fullstack

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Krish-Upadhyayy/EYE-C.git
   cd EYE-C
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Fullstack System**:
   ```bash
   npm run start
   ```
   This concurrently boots:
   - **Frontend (Vite)**: `http://localhost:5173/`
   - **Backend API (Express)**: `http://localhost:3001/`

4. **Production Build**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Netlify

EYEC includes pre-configured [`netlify.toml`](./netlify.toml) and [`public/_redirects`](./public/_redirects) for zero-configuration Netlify deployment.

### Option A: Via GitHub (Recommended)
1. Push this repository to GitHub.
2. Log into [Netlify](https://app.netlify.com/).
3. Click **Add new site** > **Import an existing project** > **GitHub**.
4. Select the **EYEC** repository.
5. Netlify will auto-detect the build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
6. Click **Deploy Site**.

### Option B: Via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/centres` | Retrieve registered training centres and active cameras |
| `POST` | `/api/centres` | Register a new vocational training centre |
| `POST` | `/api/centres/:id/cameras` | Provision a new CCTV camera to a centre |
| `POST` | `/api/snapshots/extract` | Extract raw unmasked video frame with verified headcount |
| `GET` | `/api/centres/:id/temporal-diff` | Calculate attendance delta between consecutive snapshots |
| `GET` | `/api/config/retention` | Query statutory 7-day retention policy metadata |
| `POST` | `/api/snapshots/purge-expired` | Trigger cleanup of snapshots older than 7 days (168 hours) |
| `POST` | `/api/yolo/detect` | Run decoupled YOLOv8 anchor candidate inference report |
| `GET` | `/api/analytics/performance` | Retrieve AI benchmark evaluation dataset confusion matrix |

---

## 🛡️ Statutory 7-Day Data Retention Policy

To comply with surveillance privacy standards:
1. All CCTV snapshots, video extractions, and evidence artifacts are retained for **exactly 7 days (168 hours)** from extraction.
2. A background cron daemon executes every 15 minutes, permanently purging expired media from memory and disk.
3. Every purge operation is stamped into the immutable audit ledger with the `AUD-PURGE` action tag.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
