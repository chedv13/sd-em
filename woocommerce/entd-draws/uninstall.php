<?php
/**
 * Удаление настроек при удалении плагина. Метаполя товаров не трогаем —
 * Drawing ID пригодится, если плагин поставят обратно.
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

foreach ( array( 'connection_id', 'guest_mode', 'auto_insert', 'position', 'text', 'custom_text', 'theme', 'size', 'shape', 'alignment', 'logo', 'full_width' ) as $key ) {
	delete_option( 'entd_draws_' . $key );
}
