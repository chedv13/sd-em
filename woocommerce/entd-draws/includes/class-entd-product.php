<?php
/**
 * Поля ENTD в карточке товара (Product data → General).
 */

defined( 'ABSPATH' ) || exit;

class ENTD_Product {
	public static function init() {
		add_action( 'woocommerce_product_options_general_product_data', array( __CLASS__, 'render_fields' ) );
		add_action( 'woocommerce_admin_process_product_object', array( __CLASS__, 'save_fields' ) );
	}

	public static function render_fields() {
		echo '<div class="options_group">';

		woocommerce_wp_text_input(
			array(
				'id'          => ENTD_Options::META_DRAWING_ID,
				'label'       => __( 'ENTD Drawing ID', 'entd-draws' ),
				'placeholder' => '80fee286-888b-414a-b2b9-349b56c7c6c6',
				'desc_tip'    => true,
				'description' => __( 'ID of the shop drawing in ENTD. When set, the draw button is shown on this product page.', 'entd-draws' ),
			)
		);

		woocommerce_wp_checkbox(
			array(
				'id'          => ENTD_Options::META_HIDE_ADD_TO_CART,
				'label'       => __( 'Hide “Add to cart”', 'entd-draws' ),
				'description' => __( 'Product is sold only through the draw', 'entd-draws' ),
			)
		);

		echo '</div>';
	}

	/**
	 * @param WC_Product $product
	 */
	public static function save_fields( $product ) {
		// Nonce и права уже проверены WooCommerce перед этим хуком.
		// phpcs:disable WordPress.Security.NonceVerification.Missing
		$drawing_id = isset( $_POST[ ENTD_Options::META_DRAWING_ID ] )
			? sanitize_text_field( wp_unslash( $_POST[ ENTD_Options::META_DRAWING_ID ] ) )
			: '';
		$hide       = isset( $_POST[ ENTD_Options::META_HIDE_ADD_TO_CART ] ) ? 'yes' : 'no';
		// phpcs:enable

		$product->update_meta_data( ENTD_Options::META_DRAWING_ID, trim( $drawing_id ) );
		$product->update_meta_data( ENTD_Options::META_HIDE_ADD_TO_CART, $hide );
	}

	/**
	 * @param WC_Product|int|null $product
	 */
	public static function drawing_id( $product ) {
		$product = self::resolve( $product );

		return $product ? trim( (string) $product->get_meta( ENTD_Options::META_DRAWING_ID ) ) : '';
	}

	/**
	 * @param WC_Product|int|null $product
	 */
	public static function hides_add_to_cart( $product ) {
		$product = self::resolve( $product );

		return $product
			&& 'yes' === $product->get_meta( ENTD_Options::META_HIDE_ADD_TO_CART )
			&& '' !== self::drawing_id( $product );
	}

	private static function resolve( $product ) {
		if ( $product instanceof WC_Product ) {
			return $product;
		}

		$product = wc_get_product( $product ? $product : get_the_ID() );

		return $product ? $product : null;
	}
}
