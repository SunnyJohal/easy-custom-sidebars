<?php
/**
 * Theme Admin Functionality
 *
 * Registers any functionality to use within
 * the admin area.
 *
 * @package Easy_Custom_Sidebars
 * @author  Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 */

namespace ECS\Admin;

/**
 * Load Admin Scripts
 *
 * Enqueue the css and the js for the
 * plugin's admin screen.
 *
 * @since 2.0.0
 */
function enqueue_admin_scripts() {
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . 'enqueue_admin_scripts' );
