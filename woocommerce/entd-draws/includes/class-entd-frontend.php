<?php
/**
 * Вывод кнопки на витрине: автовставка на странице товара (классические и блочные темы)
 * и шорткод [entd_draw_button]. Сам рендер делает assets/entd-woo.js по data-атрибутам.
 */

defined( 'ABSPATH' ) || exit;

class ENTD_Frontend {
	const HANDLE_LIB  = 'entd-draws-lib';
	const HANDLE_GLUE = 'entd-draws';

	// Позиция → приоритет в woocommerce_single_product_summary
	// (price 10, excerpt 20, add_to_cart 30, meta 40).
	const CLASSIC_PRIORITIES = array(
		'after_price'        => 15,
		'before_add_to_cart' => 29,
		'after_add_to_cart'  => 31,
		'after_meta'         => 41,
	);

	// Блоки формы «В корзину» в блочных шаблонах товара.
	const ADD_TO_CART_BLOCKS = array( 'woocommerce/add-to-cart-form', 'woocommerce/add-to-cart-with-options' );

	private static $counter        = 0;
	private static $config_printed = false;
	private static $auto_rendered  = array();

	public static function init() {
		// Регистрируем на init, а не на wp_enqueue_scripts: блочные темы рендерят шаблон
		// до wp_head, и шорткод должен уметь поставить скрипты в очередь уже тогда.
		add_action( 'init', array( __CLASS__, 'register_assets' ) );
		add_shortcode( 'entd_draw_button', array( __CLASS__, 'shortcode' ) );

		add_action( 'woocommerce_before_single_product', array( __CLASS__, 'setup_classic_product' ) );

		foreach ( self::ADD_TO_CART_BLOCKS as $block_name ) {
			add_filter( 'render_block_' . $block_name, array( __CLASS__, 'filter_add_to_cart_block' ), 10, 3 );
		}
	}

	public static function register_assets() {
		wp_register_script(
			self::HANDLE_LIB,
			ENTD_DRAWS_URL . 'assets/entd.js',
			array(),
			ENTD_DRAWS_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
		wp_register_script(
			self::HANDLE_GLUE,
			ENTD_DRAWS_URL . 'assets/entd-woo.js',
			array( self::HANDLE_LIB ),
			ENTD_DRAWS_VERSION,
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			)
		);
		wp_register_style( self::HANDLE_GLUE, ENTD_DRAWS_URL . 'assets/entd-woo.css', array(), ENTD_DRAWS_VERSION );
	}

	private static function enqueue() {
		wp_enqueue_style( self::HANDLE_GLUE );
		wp_enqueue_script( self::HANDLE_GLUE );

		if ( self::$config_printed ) {
			return;
		}

		self::$config_printed = true;

		$user_id = get_current_user_id();
		$config  = array(
			'connectionId' => ENTD_Options::get( 'connection_id' ),
			'siteHost'     => wp_parse_url( home_url(), PHP_URL_HOST ),
			'siteName'     => get_bloginfo( 'name' ),
			'customerId'   => $user_id ? $user_id : null,
			'guestMode'    => ENTD_Options::get( 'guest_mode' ),
			// URL логина для режима «Must log in first». Скрипт добавит redirect_to с текущей страницей.
			'loginUrl'     => apply_filters( 'entd_draws_login_url', wp_login_url() ),
			'locale'       => get_locale(),
		);

		// Inline 'before' не отменяет defer, в отличие от 'after'.
		wp_add_inline_script(
			self::HANDLE_GLUE,
			'window.ENTDWoo = window.ENTDWoo || {}; window.ENTDWoo.config = ' . wp_json_encode( $config ) . ';',
			'before'
		);
	}

	/**
	 * Разметка контейнера кнопки.
	 *
	 * @param string $drawing_id
	 * @param int    $product_id
	 * @param array  $opts       см. ENTD_Options::button_defaults()
	 * @param string $class      дополнительные классы для <button>
	 */
	public static function render_button( $drawing_id, $product_id, array $opts, $class = '' ) {
		self::enqueue();
		self::$counter++;

		$align = ENTD_Options::pick( $opts['align'], ENTD_Options::ALIGNS, 'left' );

		return sprintf(
			'<div class="entd-draw entd-draw--%1$s" data-entd-block="entd-%2$d" data-drawing-id="%3$s" data-product-id="%4$s" data-theme="%5$s" data-size="%6$s" data-shape="%7$s" data-text="%8$s" data-logo="%9$s" data-full-width="%10$s" data-class-name="%11$s"></div>',
			esc_attr( $align ),
			self::$counter,
			esc_attr( $drawing_id ),
			esc_attr( $product_id ? (string) $product_id : '' ),
			esc_attr( ENTD_Options::pick( $opts['theme'], ENTD_Options::THEMES, 'light' ) ),
			esc_attr( ENTD_Options::pick( $opts['size'], ENTD_Options::SIZES, 'medium' ) ),
			esc_attr( ENTD_Options::pick( $opts['shape'], ENTD_Options::SHAPES, 'rectangular' ) ),
			esc_attr( $opts['text'] ),
			$opts['logo'] ? 'true' : 'false',
			$opts['full_width'] ? 'true' : 'false',
			esc_attr( $class )
		);
	}

	/**
	 * [entd_draw_button drawing_id="" product_id="" text="" theme="" size="" shape="" align="" logo="" full_width="" class=""]
	 *
	 * Без drawing_id берётся Drawing ID товара product_id или текущего товара.
	 */
	public static function shortcode( $atts ) {
		$defaults = ENTD_Options::button_defaults();
		$atts     = shortcode_atts(
			array(
				'drawing_id' => '',
				'product_id' => '',
				'text'       => $defaults['text'],
				'theme'      => $defaults['theme'],
				'size'       => $defaults['size'],
				'shape'      => $defaults['shape'],
				'align'      => $defaults['align'],
				'logo'       => $defaults['logo'] ? 'yes' : 'no',
				'full_width' => $defaults['full_width'] ? 'yes' : 'no',
				'class'      => '',
			),
			$atts,
			'entd_draw_button'
		);

		$product_id = absint( $atts['product_id'] );

		if ( ! $product_id && function_exists( 'is_product' ) && is_product() ) {
			$product_id = get_the_ID();
		}

		$drawing_id = trim( $atts['drawing_id'] );

		if ( '' === $drawing_id && $product_id ) {
			$drawing_id = ENTD_Product::drawing_id( $product_id );
		}

		if ( '' === $drawing_id ) {
			return self::editor_hint();
		}

		$opts               = $atts;
		$opts['logo']       = wc_string_to_bool( $atts['logo'] );
		$opts['full_width'] = wc_string_to_bool( $atts['full_width'] );

		return self::render_button( $drawing_id, $product_id, $opts, $atts['class'] );
	}

	private static function editor_hint() {
		if ( ! current_user_can( 'edit_products' ) ) {
			return '';
		}

		return '<p class="entd-draw__hint">' . esc_html__( 'ENTD: set drawing_id in the shortcode or the ENTD Drawing ID on the product (visible to shop managers only).', 'entd-draws' ) . '</p>';
	}

	/**
	 * Автовставка для классических тем (хук woocommerce_single_product_summary).
	 */
	public static function setup_classic_product() {
		global $product;

		if ( ! $product instanceof WC_Product ) {
			return;
		}

		if ( ENTD_Product::hides_add_to_cart( $product ) ) {
			remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
		}

		if ( ! ENTD_Options::enabled( 'auto_insert' ) || '' === ENTD_Product::drawing_id( $product ) ) {
			return;
		}

		$position = ENTD_Options::get( 'position' );
		$priority = isset( self::CLASSIC_PRIORITIES[ $position ] ) ? self::CLASSIC_PRIORITIES[ $position ] : 31;

		add_action( 'woocommerce_single_product_summary', array( __CLASS__, 'print_auto_button' ), $priority );
	}

	public static function print_auto_button() {
		global $product;

		// Разметка собрана в render_button() с esc_attr.
		echo self::auto_button( $product ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}

	private static function auto_button( $product ) {
		if ( ! $product instanceof WC_Product ) {
			return '';
		}

		$product_id = $product->get_id();
		$drawing_id = ENTD_Product::drawing_id( $product );

		// Одна автокнопка на товар, даже если тема выводит форму дважды.
		if ( '' === $drawing_id || isset( self::$auto_rendered[ $product_id ] ) ) {
			return '';
		}

		self::$auto_rendered[ $product_id ] = true;

		return self::render_button( $drawing_id, $product_id, ENTD_Options::button_defaults() );
	}

	/**
	 * Автовставка для блочных тем: рядом с блоком формы «В корзину».
	 *
	 * @param string        $content
	 * @param array         $block
	 * @param WP_Block|null $instance
	 */
	public static function filter_add_to_cart_block( $content, $block, $instance = null ) {
		$product_id = ( $instance instanceof WP_Block && ! empty( $instance->context['postId'] ) )
			? (int) $instance->context['postId']
			: get_the_ID();
		$product    = $product_id ? wc_get_product( $product_id ) : null;

		if ( ! $product ) {
			return $content;
		}

		if ( ENTD_Product::hides_add_to_cart( $product ) ) {
			$content = '';
		}

		if ( ! ENTD_Options::enabled( 'auto_insert' ) ) {
			return $content;
		}

		$button = self::auto_button( $product );

		return 'before_add_to_cart' === ENTD_Options::get( 'position' ) ? $button . $content : $content . $button;
	}
}
