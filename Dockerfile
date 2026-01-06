# ---- Base image ----
FROM python:3.12-slim

# ---- System deps (minimal) ----
RUN apt-get update && apt-get install -y \
    ffmpeg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---- Environment ----
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# ---- Install Piper HTTP API ----
RUN python3 -m pip install "piper-tts[http]"

# ---- Download voice (cached in image) ----
RUN python3 -m piper.download_voices en_US-lessac-medium

# ---- Expose HTTP API port ----
EXPOSE 5000

# ---- Run Piper HTTP server ----
CMD ["python3", "-m", "piper.http_server", "-m", "en_US-lessac-medium", "--host", "0.0.0.0", "--port", "5000"]
