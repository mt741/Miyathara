#!/usr/bin/env bash
# Run once on the server, as root: sudo bash ~/miyathara/deploy/setup-https.sh
# 1. Gets a Let's Encrypt certificate for the domain (certbot nginx plugin, as for the other sites).
# 2. Installs the nginx site and reloads nginx.
set -euo pipefail
DOMAIN=miyathara.duckdns.org
SITE=/etc/nginx/sites-available/miyathara
HERE="$(cd "$(dirname "$0")" && pwd)"

if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  certbot certonly --nginx -d "$DOMAIN" --key-type ecdsa
fi

install -m 644 "$HERE/nginx-miyathara.conf" "$SITE"
ln -sfn "$SITE" /etc/nginx/sites-enabled/miyathara
nginx -t
systemctl reload nginx
echo "Done: https://$DOMAIN"
