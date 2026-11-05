# AgriIntel: Agricultural Supply Chain Prediction & Market Intelligence System

AgriIntel is a hackathon-grade market intelligence platform built across 4 parallel developer streams:
1. **Part 1 (Data & Platform)**: Ingests daily Agmarknet mandi prices, Open-Meteo weather forecasts, MSP benchmarks, fuel prices, and district boundaries.
2. **Part 2 (Intelligence & ML)**: Price hike alerts, time-split validated ML forecasting, and district-level atlas views.
3. **Part 3 (Logistics & Marketplace)**: Route & toll cost calculations, best net-profit market finder, and an MSP-referenced marketplace.
4. **Part 4 (Frontend)**: React 18 + Vite + TypeScript dashboard with maps, charts, and alert badges.

---

## Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm (for frontend)

### 1. Backend Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment configuration
cp .env.example .env

# Run the backend
cd backend
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend application will be live at: `http://localhost:5173`

---

## Testing & Verification
From repo root:
```bash
# Backend contract tests
cd backend
pytest -q

# Integration check script
cd ..
python scripts/verify.py
```
