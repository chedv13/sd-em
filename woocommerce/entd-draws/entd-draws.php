<?php
/**
 * Plugin Name:       ENTD Draws for WooCommerce
 * Description:       Adds an ENTD draw button to WooCommerce product pages. Visitors enter the draw in the ENTD modal without leaving the store.
 * Version:           0.1.0
 * Author:            ENTD
 * Text Domain:       entd-draws
 * Domain Path:       /languages
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * Requires Plugins:  woocommerce
 * WC requires at least: 8.0
 * License:           ISC
 */

defined( 'ABSPATH' ) || exit;

define( 'ENTD_DRAWS_VERSION', '0.1.0' );
define( 'ENTD_DRAWS_FILE', __FILE__ );
define( 'ENTD_DRAWS_DIR', plugin_dir_path( __FILE__ ) );
define( 'ENTD_DRAWS_URL', plugin_dir_url( __FILE__ ) );

require_once ENTD_DRAWS_DIR . 'includes/class-entd-options.php';
require_once ENTD_DRAWS_DIR . 'includes/class-entd-settings.php';
require_once ENTD_DRAWS_DIR . 'includes/class-entd-product.php';
require_once ENTD_DRAWS_DIR . 'includes/class-entd-frontend.php';

// Плагин не трогает заказы и checkout — честно объявляем совместимость с HPOS и блочным checkout.
add_action(
	'before_woocommerce_init',
	static function () {
		if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', ENTD_DRAWS_FILE, true );
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'cart_checkout_blocks', ENTD_DRAWS_FILE, true );
		}
	}
);

add_action(
	'plugins_loaded',
	static function () {
		load_plugin_textdomain( 'entd-draws', false, dirname( plugin_basename( ENTD_DRAWS_FILE ) ) . '/languages' );

		if ( ! class_exists( 'WooCommerce' ) ) {
			add_action(
				'admin_notices',
				static function () {
					echo '<div class="notice notice-error"><p>' . esc_html__( 'ENTD Draws requires WooCommerce to be installed and active.', 'entd-draws' ) . '</p></div>';
				}
			);
			return;
		}

		ENTD_Settings::init();
		ENTD_Product::init();
		ENTD_Frontend::init();
	}
);

add_filter(
	'plugin_action_links_' . plugin_basename( ENTD_DRAWS_FILE ),
	static function ( $links ) {
		$url = admin_url( 'admin.php?page=wc-settings&tab=' . ENTD_Settings::TAB );
		array_unshift( $links, '<a href="' . esc_url( $url ) . '">' . esc_html__( 'Settings', 'entd-draws' ) . '</a>' );
		return $links;
	}
);
