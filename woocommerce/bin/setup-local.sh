#!/usr/bin/env bash
# Ставит WordPress + WooCommerce на локальном стенде и создаёт тестовый товар с Drawing ID.
# Переменные: WP_PORT (8080), ENTD_CONNECTION_ID, ENTD_DRAWING_ID.
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${WP_PORT:-8080}"
wp() { docker compose run --rm -T cli "$@"; }

echo "Waiting for WordPress files and DB..."
for _ in $(seq 1 60); do
  if wp core is-installed >/dev/null 2>&1; then break; fi
  if wp db check >/dev/null 2>&1 && docker compose exec -T wordpress test -f /var/www/html/wp-config.php; then
    wp core install --url="http://localhost:${PORT}" --title="ENTD Woo Dev" \
      --admin_user=admin --admin_password=admin --admin_email=dev@example.com --skip-email
    break
  fi
  sleep 2
done

wp plugin is-installed woocommerce || wp plugin install woocommerce
wp plugin activate woocommerce entd-draws
wp theme is-installed storefront || wp theme install storefront
wp theme activate storefront
wp rewrite structure '/%postname%/' --hard >/dev/null

if [ -n "${ENTD_CONNECTION_ID:-}" ]; then
  wp option update entd_draws_connection_id "$ENTD_CONNECTION_ID"
fi

DRAWING_ID="${ENTD_DRAWING_ID:-80fee286-888b-414a-b2b9-349b56c7c6c6}"
PRODUCT_ID="$(wp post list --post_type=product --name=entd-test-sneakers --field=ID)"
if [ -z "$PRODUCT_ID" ]; then
  PRODUCT_ID="$(wp wc product create --user=admin --name='ENTD Test Sneakers' --slug=entd-test-sneakers \
    --regular_price=199 --status=publish --porcelain)"
fi
wp post meta update "$PRODUCT_ID" _entd_drawing_id "$DRAWING_ID" >/dev/null

echo
echo "Admin:   http://localhost:${PORT}/wp-admin  (admin / admin)"
echo "Product: http://localhost:${PORT}/product/entd-test-sneakers/"
echo "Settings: WooCommerce → Settings → ENTD Draws"
