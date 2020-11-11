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
	// 1. Check if you are in the customizer.
	// 2. Call dynamic_sidebar() for each replacement
	//    sidebar relevent to this page (in the output
	//    buffer!).
}
add_action( 'wp_footer', __NAMESPACE__ . '\\prepare_sidebars_for_customizer' );
