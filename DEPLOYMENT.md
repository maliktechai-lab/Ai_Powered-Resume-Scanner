# Deployment Guide

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Compose)
- Git

---

## 1. Docker (Local / Single Server)

The fastest path. All three services (nginx, FastAPI, MongoDB) run in one `docker compose up`.

```bash
git clone <repo-url>
cd resume-scanner

# Create your env file
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set a strong `SECRET_KEY`:

```
SECRET_KEY=replace-with-32-plus-random-characters
```

Then start everything:

```bash
docker compose up --build
```

| URL | Service |
|-----|---------|
| http://localhost | App (nginx → React SPA) |
| http://localhost/api/docs | FastAPI Swagger UI |
| http://localhost/health | Health check |

### Background mode

```bash
docker compose up -d --build   # start detached
docker compose logs -f          # stream logs
docker compose down             # stop
docker compose down -v          # stop + wipe MongoDB data
```

### Change the host port

```bash
PORT=8080 docker compose up -d --build
# App now at http://localhost:8080
```

---

## 2. VPS / Cloud VM (Ubuntu)

Deploy to any Linux VM (AWS EC2, DigitalOcean Droplet, Hetzner, etc.).

### Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER && newgrp docker
```

### Deploy

```bash
git clone <repo-url>
cd resume-scanner
cp backend/.env.example backend/.env
# Edit backend/.env — set SECRET_KEY and CORS_ORIGINS

docker compose up -d --build
```

### HTTPS with Caddy (recommended)

Install Caddy:

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy
```

Create `/etc/caddy/Caddyfile`:

```
yourdomain.com {
    reverse_proxy localhost:80
}
```

```bash
sudo systemctl reload caddy
```

Caddy auto-provisions a Let's Encrypt TLS certificate. Update `CORS_ORIGINS` in `backend/.env`:

```
CORS_ORIGINS=https://yourdomain.com
```

Then restart the stack:

```bash
docker compose up -d
```

---

## 3. Separate Frontend + Backend (Vercel / Render)

Use this when you want the frontend on a CDN and the backend on a container platform.

### Backend on Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your repo, set **Root Directory** to `backend`
3. Set **Dockerfile path** to `backend/Dockerfile`
4. Add environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `SECRET_KEY` — strong random string
   - `CORS_ORIGINS` — `https://your-frontend.vercel.app`
5. Deploy

### Frontend on Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `VITE_API_BASE_URL` — `https://your-backend.onrender.com/api`
4. Deploy

### MongoDB Atlas (managed database)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist your backend's IP (or `0.0.0.0/0` for Render's dynamic IPs)
3. Copy the connection string and set it as `MONGO_URI`

---

## 4. Environment Variables Reference

All variables are set in `backend/.env` (copy from `backend/.env.example`).

| Variable | Default | Required | Description |
|---|---|---|---|
| `SECRET_KEY` | — | **Yes** | JWT signing secret — use 32+ random chars |
| `MONGO_URI` | `mongodb://mongo:27017` | No | MongoDB connection string |
| `DB_NAME` | `resume_scanner` | No | MongoDB database name |
| `ALGORITHM` | `HS256` | No | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | No | Token lifetime (default 24 h) |
| `CORS_ORIGINS` | `http://localhost,http://127.0.0.1` | No | Comma-separated allowed origins |

Root `.env` (next to `docker-compose.yml`) for compose-level overrides:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `80` | Host port mapped to nginx |

---

## 5. Production Checklist

- [ ] `SECRET_KEY` is a long random string (never the default)
- [ ] `CORS_ORIGINS` is restricted to your actual domain
- [ ] HTTPS is enabled (Caddy, Traefik, or cloud load balancer)
- [ ] MongoDB is not publicly exposed (no published port 27017)
- [ ] MongoDB has authentication enabled (Atlas handles this automatically)
- [ ] `mongo_data` Docker volume is backed up regularly
- [ ] Container restart policy is `unless-stopped` (already set in compose)

---

## 6. Useful Commands

```bash
# Rebuild a single service after code change
docker compose up -d --build backend

# View logs for one service
docker compose logs -f backend

# Open a shell inside the backend container
docker compose exec backend bash

# Run tests
docker compose exec backend pytest tests/ -v

# Check health
curl http://localhost/health
```
