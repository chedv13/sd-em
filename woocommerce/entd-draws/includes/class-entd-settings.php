<?php
/**
 * Вкладка WooCommerce → Settings → ENTD Draws.
 */

defined( 'ABSPATH' ) || exit;

class ENTD_Settings {
	const TAB = 'entd_draws';

	public static function init() {
		add_filter( 'woocommerce_settings_tabs_array', array( __CLASS__, 'add_tab' ), 50 );
		add_action( 'woocommerce_settings_tabs_' . self::TAB, array( __CLASS__, 'render' ) );
		add_action( 'woocommerce_update_options_' . self::TAB, array( __CLASS__, 'save' ) );
	}

	public static function add_tab( $tabs ) {
		$tabs[ self::TAB ] = __( 'ENTD Draws', 'entd-draws' );
		return $tabs;
	}

	public static function render() {
		woocommerce_admin_fields( self::fields() );
	}

	public static function save() {
		woocommerce_update_options( self::fields() );
	}

	private static function id( $key ) {
		return ENTD_Options::PREFIX . $key;
	}

	public static function fields() {
		$d = ENTD_Options::DEFAULTS;

		return array(
			array(
				'type'  => 'title',
				'id'    => self::id( 'connection' ),
				'title' => __( 'Connection', 'entd-draws' ),
				'desc'  => __( 'Connects your store to ENTD. Set the Drawing ID on a product (Product data → General) to show the draw button on its page, or use the [entd_draw_button] shortcode anywhere.', 'entd-draws' ),
			),
			array(
				'type'     => 'text',
				'id'       => self::id( 'connection_id' ),
				'title'    => __( 'Connection ID', 'entd-draws' ),
				'desc_tip' => __( 'Unique identifier of your shop in the ENTD system.', 'entd-draws' ),
				'default'  => $d['connection_id'],
				'css'      => 'min-width: 360px;',
			),
			array(
				'type'     => 'select',
				'id'       => self::id( 'guest_mode' ),
				'title'    => __( 'Visitors who are not logged in', 'entd-draws' ),
				'desc_tip' => __( 'Logged-in customers are always identified by their WordPress user ID.', 'entd-draws' ),
				'default'  => $d['guest_mode'],
				'options'  => array(
					'anonymous' => __( 'Can enter with an anonymous ID', 'entd-draws' ),
					'login'     => __( 'Must log in first', 'entd-draws' ),
				),
			),
			array(
				'type' => 'sectionend',
				'id'   => self::id( 'connection' ),
			),

			array(
				'type'  => 'title',
				'id'    => self::id( 'placement' ),
				'title' => __( 'Product page', 'entd-draws' ),
			),
			array(
				'type'    => 'checkbox',
				'id'      => self::id( 'auto_insert' ),
				'title'   => __( 'Show automatically', 'entd-draws' ),
				'desc'    => __( 'Insert the button on product pages that have a Drawing ID', 'entd-draws' ),
				'default' => $d['auto_insert'],
			),
			array(
				'type'     => 'select',
				'id'       => self::id( 'position' ),
				'title'    => __( 'Position', 'entd-draws' ),
				'default'  => $d['position'],
				'options'  => array(
					'after_price'        => __( 'After price', 'entd-draws' ),
					'before_add_to_cart' => __( 'Before “Add to cart”', 'entd-draws' ),
					'after_add_to_cart'  => __( 'After “Add to cart”', 'entd-draws' ),
					'after_meta'         => __( 'After product meta', 'entd-draws' ),
				),
				'desc_tip' => __( 'Block themes support only “Before” and “After Add to cart”; other values fall back to “After Add to cart”.', 'entd-draws' ),
			),
			array(
				'type' => 'sectionend',
				'id'   => self::id( 'placement' ),
			),

			array(
				'type'  => 'title',
				'id'    => self::id( 'appearance' ),
				'title' => __( 'Button appearance', 'entd-draws' ),
				'desc'  => __( 'Defaults for every button. Shortcode attributes override them.', 'entd-draws' ),
			),
			array(
				'type'    => 'select',
				'id'      => self::id( 'text' ),
				'title'   => __( 'Label', 'entd-draws' ),
				'default' => $d['text'],
				'options' => array(
					'enter_draw'    => __( 'Enter draw', 'entd-draws' ),
					'join_giveaway' => __( 'Join giveaway', 'entd-draws' ),
					'participate'   => __( 'Participate', 'entd-draws' ),
					'try_your_luck' => __( 'Try your luck', 'entd-draws' ),
					'custom'        => __( 'Custom text', 'entd-draws' ),
				),
			),
			array(
				'type'     => 'text',
				'id'       => self::id( 'custom_text' ),
				'title'    => __( 'Custom text', 'entd-draws' ),
				'desc_tip' => __( 'Used when Label is set to “Custom text”.', 'entd-draws' ),
				'default'  => $d['custom_text'],
			),
			array(
				'type'    => 'select',
				'id'      => self::id( 'theme' ),
				'title'   => __( 'Theme', 'entd-draws' ),
				'default' => $d['theme'],
				'options' => array(
					'light' => __( 'Light', 'entd-draws' ),
					'dark'  => __( 'Dark', 'entd-draws' ),
					'auto'  => __( 'Auto (follows visitor’s system)', 'entd-draws' ),
				),
			),
			array(
				'type'    => 'select',
				'id'      => self::id( 'size' ),
				'title'   => __( 'Size', 'entd-draws' ),
				'default' => $d['size'],
				'options' => array(
					'small'  => __( 'Small', 'entd-draws' ),
					'medium' => __( 'Medium', 'entd-draws' ),
					'large'  => __( 'Large', 'entd-draws' ),
				),
			),
			array(
				'type'    => 'select',
				'id'      => self::id( 'shape' ),
				'title'   => __( 'Shape', 'entd-draws' ),
				'default' => $d['shape'],
				'options' => array(
					'rectangular' => __( 'Rectangular', 'entd-draws' ),
					'pill'        => __( 'Pill', 'entd-draws' ),
				),
			),
			array(
				'type'    => 'select',
				'id'      => self::id( 'alignment' ),
				'title'   => __( 'Alignment', 'entd-draws' ),
				'default' => $d['alignment'],
				'options' => array(
					'left'   => __( 'Left', 'entd-draws' ),
					'center' => __( 'Center', 'entd-draws' ),
					'right'  => __( 'Right', 'entd-draws' ),
				),
			),
			array(
				'type'    => 'checkbox',
				'id'      => self::id( 'logo' ),
				'title'   => __( 'ENTD mark', 'entd-draws' ),
				'desc'    => __( 'Show the ENTD mark before the label', 'entd-draws' ),
				'default' => $d['logo'],
			),
			array(
				'type'    => 'checkbox',
				'id'      => self::id( 'full_width' ),
				'title'   => __( 'Full width', 'entd-draws' ),
				'desc'    => __( 'Stretch the button to the container width', 'entd-draws' ),
				'default' => $d['full_width'],
			),
			array(
				'type' => 'sectionend',
				'id'   => self::id( 'appearance' ),
			),
		);
	}
}
