<?php
/**
 * Чтение настроек плагина и допустимые значения для внешнего вида кнопки.
 */

defined( 'ABSPATH' ) || exit;

class ENTD_Options {
	const PREFIX = 'entd_draws_';

	// Метаполя товара.
	const META_DRAWING_ID       = '_entd_drawing_id';
	const META_HIDE_ADD_TO_CART = '_entd_hide_add_to_cart';

	// Совпадают с DrawingButtonOptions в src/index.ts.
	const THEMES = array( 'light', 'dark', 'auto' );
	const SIZES  = array( 'small', 'medium', 'large' );
	const SHAPES = array( 'rectangular', 'pill' );
	const ALIGNS = array( 'left', 'center', 'right' );

	const DEFAULTS = array(
		'connection_id' => '',
		'guest_mode'    => 'anonymous',
		'auto_insert'   => 'yes',
		'position'      => 'after_add_to_cart',
		'text'          => 'enter_draw',
		'custom_text'   => '',
		'theme'         => 'light',
		'size'          => 'medium',
		'shape'         => 'rectangular',
		'alignment'     => 'left',
		'logo'          => 'yes',
		'full_width'    => 'no',
	);

	public static function get( $key ) {
		$default = isset( self::DEFAULTS[ $key ] ) ? self::DEFAULTS[ $key ] : '';
		$value   = get_option( self::PREFIX . $key, $default );

		return is_string( $value ) ? trim( $value ) : $default;
	}

	public static function enabled( $key ) {
		return 'yes' === self::get( $key );
	}

	/**
	 * Настройки кнопки по умолчанию (из WooCommerce → Settings → ENTD Draws).
	 */
	public static function button_defaults() {
		$text = self::get( 'text' );

		if ( 'custom' === $text ) {
			$text = self::get( 'custom_text' );
		}

		return array(
			'text'       => '' !== $text ? $text : 'enter_draw',
			'theme'      => self::get( 'theme' ),
			'size'       => self::get( 'size' ),
			'shape'      => self::get( 'shape' ),
			'align'      => self::get( 'alignment' ),
			'logo'       => self::enabled( 'logo' ),
			'full_width' => self::enabled( 'full_width' ),
		);
	}

	public static function pick( $value, array $allowed, $fallback ) {
		return in_array( $value, $allowed, true ) ? $value : $fallback;
	}
}
