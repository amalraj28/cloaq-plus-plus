# CloaQ

CloaQ is packaged as a single Dockerized web application with:

- a React frontend in `frontend/`
- a FastAPI backend in `backend/`

The container serves the website and API together on port `8000`.

## Run the public image

If the public image has already been published, the simplest way to run CloaQ is:

```bash
docker run --rm -p 8000:8000 cloaq/cloaq:latest
```

Then open:

```text
http://localhost:8000
```

Notes:

- The container logs may show `0.0.0.0:8000`. That is the internal bind address inside Docker.
- In your browser, use `localhost:8000`, not `0.0.0.0:8000`.
- `--rm` removes the stopped container automatically when you exit it.

## Run from source with Docker Compose

To build and run the app from this repository:

```bash
docker compose up --build
```

Then open:

```text
http://localhost:8000
```

To stop it:

```bash
docker compose down
```

## Publish the Docker image

To publish a multi-platform image for both `linux/amd64` and `linux/arm64`:

```bash
docker login
docker buildx create --use --name cloaq-builder
docker buildx build --platform linux/amd64,linux/arm64 -t cloaq/cloaq:latest --push .
```

To verify the published image:

```bash
docker buildx imagetools inspect cloaq/cloaq:latest
```

You should see entries for:

- `linux/amd64`
- `linux/arm64`

## Repository layout

```text
backend/   FastAPI application
frontend/  React/Vite application
Dockerfile Combined production image
compose.yaml Local Docker Compose setup
```

## Local development without Docker

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

On Windows PowerShell, activate the virtual environment with:

```powershell
.venv\Scripts\Activate.ps1
```
