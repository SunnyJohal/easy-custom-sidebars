<?php
/**
 * Customizer
 *
 * Registers any functionality to use within
 * the customizer.
 *
 * @package Easy_Custom_Sidebars
 * @author  Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 */

namespace ECS\Customizer;

use ECS\Data;
use ECS\Frontend;

$_ecs_dynamic_sidebar_data = false;
$_ecs_active_sidebar_data  = false;

/**
 * Prepare Custom Sidebars for Customizer
 *
 * Calls dynamic_sidebar() for each custom sidebar
 * in the output buffer so that it can be detected
 * and shown in the WordPress customizer.
 */
function prepare_sidebars_for_customizer() {
	if ( ! is_customize_preview() ) {
		return;
	}

	if ( ! Frontend\sidebar_replacements_determined() ) {
		$default_widget_area_ids = wp_list_pluck( Data\get_default_registered_sidebars(), 'id' );
		Frontend\determine_sidebar_replacements( $default_widget_area_ids );
	}

	$all_replacements = Frontend\get_all_sidebar_replacements();

	if ( ! empty( $all_replacements ) ) {
		ob_start();

		// Call dynamic_sidebar() in the output buffer so
		// that the customizer detects the replacement.
		foreach ( $all_replacements as $id => $replacement_id ) {
			dynamic_sidebar( $replacement_id );
		}

		ob_end_clean();
	}
}
add_action( 'wp_footer', __NAMESPACE__ . '\\prepare_sidebars_for_customizer' );
