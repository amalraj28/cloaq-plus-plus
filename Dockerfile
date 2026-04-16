# ---- Stage 1: Build frontend ----
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend ./
RUN npm run build

# ---- Stage 2: Install Python dependencies ----
FROM python:3.11-slim AS deps-builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --upgrade pip && pip install -r ./backend/requirements.txt \
    && find /usr/local -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null; \
       find /usr/local -type f -name '*.pyc' -delete 2>/dev/null; \
       find /usr/local -type f -name '*.pyo' -delete 2>/dev/null; \
       rm -rf /root/.cache

# ---- Stage 3: Runtime ----
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps-builder /usr/local/bin /usr/local/bin
COPY backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
