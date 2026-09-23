#!/bin/sh
# Кладёт собранные бандлы в entd-frontend: они раздаются как /em/entd.js, /em/entd-embed.js
# и /em/entd-gtm.js (prod на entd.tech, staging на aientd.space — см. next.config.ts там).
set -e

FRONTEND="${ENTD_FRONTEND_DIR:-../../entd-frontend}"
TARGET="$FRONTEND/public/sdk"

if [ ! -d "$FRONTEND" ]; then
  echo "entd-frontend not found at $FRONTEND (set ENTD_FRONTEND_DIR)" >&2
  exit 1
fi

mkdir -p "$TARGET/prod" "$TARGET/staging"

cp build/prod/index.js "$TARGET/prod/entd.js"
cp build/entd-embed.js "$TARGET/prod/entd-embed.js"
cp ../gtm/build/entd-gtm.js "$TARGET/prod/entd-gtm.js"

cp build/staging/index.js "$TARGET/staging/entd.js"
cp build/entd-embed.staging.js "$TARGET/staging/entd-embed.js"
cp ../gtm/build/entd-gtm.staging.js "$TARGET/staging/entd-gtm.js"

echo "Copied bundles to $TARGET — commit them in entd-frontend and deploy."
