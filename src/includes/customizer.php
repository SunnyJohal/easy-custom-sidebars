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

function prepare_sidebars_for_customizer() {
	// 1. Check if you are in the customizer.
	// 2. Call dynamic_sidebar() for each replacement
	//    sidebar relevent to this page (in the output
	//    buffer!).
}
add_action( 'wp_footer', __NAMESPACE__ . '\\prepare_sidebars_for_customizer' );
