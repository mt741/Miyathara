#!/usr/bin/env bash
# Copy the project to the server, then build and restart the container.
# Usage: ./deploy/deploy.sh
set -euo pipefail
HOST=core@92.47.152.2
PORT=2222
DIR=miyathara
cd "$(dirname "$0")/.."

COPYFILE_DISABLE=1 tar --no-xattrs --exclude=node_modules --exclude=dist --exclude=.git -czf - . \
  | ssh -p "$PORT" "$HOST" "mkdir -p ~/$DIR && tar -xzf - -C ~/$DIR"
ssh -p "$PORT" "$HOST" "cd ~/$DIR \
  && (grep -q '^WEB_PORT=' .env 2>/dev/null || echo 'WEB_PORT=127.0.0.1:8095' >> .env) \
  && docker compose --profile prod up -d --build web \
  && docker image prune -f >/dev/null \
  && docker compose ps web"
