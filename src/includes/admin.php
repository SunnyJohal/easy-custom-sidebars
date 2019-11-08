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

use ECS\Setup;

/**
 * Add Admin Plugin Settings Page
 */
function add_plugin_settings_page() {
	add_theme_page(
		__( 'Theme Sidebars', 'easy-custom-sidebars' ),
		__( 'Theme Sidebars', 'easy-custom-sidebars' ),
		'edit_theme_options',
		'easy-custom-sidebars',
		__NAMESPACE__ . '\\get_plugin_settings_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\\add_plugin_settings_page' );

/**
 * Get Plugin Settings Page
 *
 * Outputs the root div which the React App
 * will use to render the settings page to
 * the DOM.
 *
 * @since 2.0.0
 */
function get_plugin_settings_page() {
	echo '<div id="ecs-root"></div>';
}

/**
 * Load Admin Scripts
 *
 * Enqueue the css and the js for the
 * plugin's admin screen.
 *
 * @since 2.0.0
 */
function enqueue_admin_scripts() {
	if ( is_plugin_settings_page() ) {
		// Admin css.
		wp_enqueue_style(
			'easy-custom-sidebars/admin',
			Setup\get_plugin_src_url() . 'dist/admin.css',
			[
				'wp-components',
				'wp-editor',
			],
			'2.0.0'
		);

		// Admin js.
		wp_enqueue_script(
			'easy-custom-sidebars/admin',
			Setup\get_plugin_src_url() . 'dist/admin.js',
			[
				'react',
				'react-dom',
				'wp-api-fetch',
				'wp-components',
				'wp-element',
				'wp-hooks',
				'wp-i18n',
			],
			'2.0.0',
			true
		);
	}
}
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_admin_scripts' );

/**
 * Is Plugin Settings Page
 *
 * @return boolean true|false if the user is currently
 *                 on the settings page.
 *
 * @since 2.0.0
 */
function is_plugin_settings_page() {
	return 'appearance_page_easy-custom-sidebars' === get_current_screen()->id;
}
