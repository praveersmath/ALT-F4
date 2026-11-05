# Multi-stage production build for AgriIntel Karnataka Full-Stack
# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline || npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend Runtime
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY requirements/ ./requirements/
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY backend/ ./backend/
COPY agriintel.db ./backend/agriintel.db

# Copy built frontend assets from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV PORT=8000
ENV AGRIINTEL_DB_PATH=/app/backend/agriintel.db
ENV PYTHONPATH=/app/backend

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000}"]
