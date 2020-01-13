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
	return get_plugin_settings_screen_id() === get_current_screen()->id;
}

/**
 * Get Plugin Settings Page ID
 *
 * @return string plugin setting page hook slug.
 *
 * @since 2.0.0
 */
function get_plugin_settings_screen_id() {
	return 'appearance_page_easy-custom-sidebars';
}

/**
 * Add Admin Page Help Tabs
 *
 * Adds contextual help tabs to the admin
 * themes sidebar page.
 *
 * @since 2.0.0
 */
function add_help_tabs() {
	$screen = get_current_screen();

	// Content.
	$screen->add_help_tab(
		[
			'id'      => 'overview',
			'title'   => __( 'Overview', 'easy-custom-sidebars' ),
			'content' => get_help_tab_content(),
		]
	);

	// Sidebar.
	$screen->set_help_sidebar(
		'<p><strong>' . __( 'For more information:', 'easy-custom-sidebars' ) . '</strong></p>' .
		'<p><a href="http://codex.wordpress.org/Function_Reference/register_sidebar" target="_blank">' . __( 'Documentation on Registering Sidebars', 'easy-custom-sidebars' ) . '</a></p>' .
		'<p><a href="http://wordpress.org/support/" target="_blank">' . __( 'Support Forums', 'easy-custom-sidebars' ) . '</a></p>'
	);
}
add_action(
	'load-' . get_plugin_settings_screen_id(),
	__NAMESPACE__ . '\\add_help_tabs'
);

/**
 * Get Help Tab Content
 *
 * Returns the html markup to be used in
 * the help tab content on the plugin
 * settings page.
 *
 * @since 2.0.0
 */
function get_help_tab_content() {
	$content  = '<p>' . __( 'This screen is used for managing your custom sidebars. It provides a way to replace the default widget areas that have been registed with your theme. If your theme does not natively support widget areas you can learn about adding this support by following the documentation link to the side.', 'easy-custom-sidebars' ) . '</p>';
	$content .= '<p>' . __( 'From this screen you can:', 'easy-custom-sidebars' ) . '</p>';
	$content .= '<ul><li>' . __( 'Create, edit, and delete sidebar replacements', 'easy-custom-sidebars' ) . '</li>';
	$content .= '<li>' . __( 'Choose which widget area you would like to replace', 'easy-custom-sidebars' ) . '</li>';
	$content .= '<li>' . __( 'Add, organize, and modify pages/posts etc that belong to a custom sidebar', 'easy-custom-sidebars' ) . '</li></ul>';

	return $content;
}
