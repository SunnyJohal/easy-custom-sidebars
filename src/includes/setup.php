<?php
/**
 * Plugin Setup
 *
 * Contains information about the file structure of
 * the plugin along with any custom rewrite logic.
 *
 * @package Easy_Custom_Sidebars
 * @author  Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 */

namespace ECS\Setup;

/**
 * Add Plugin Settings Rewrite Rule
 */
function add_plugin_rewrite_rules() {
	// What do I want to do.
	// 1. Have a catch-all route easy-custom-sidebars/ that goes to the plugin settings page.
	// 2. Have the react app boot up in it's place to manage state and pick up the url variables.
	// 3. Not have any warnings/errors whenever I load a route.

	// Issues.
	// 1. WordPress/Browser is rewriting the trailing slash to a html entity.
	// 2. Currently, any catch all page is triggering a can't access capability error.

	// Distinctions.

	// Options.
	// 1. Manually register each route with WordPress on the PHP side.
}
add_action( 'init', __NAMESPACE__ . '\\add_plugin_rewrite_rules' );

/**
 * Get Plugin File URL
 *
 * Gets the URL to the /src/ directory
 * in the plugin directory with the
 * trailing slash.
 *
 * @return string URL to the src directory with the trailing slash.
 * @since 2.0.0
 */
function get_plugin_src_url() {
	return trailingslashit( plugins_url( 'easy-custom-sidebars/src' ) );
}

/**
 * Get Plugin File Path
 *
 * Gets the file path to the /src/ directory
 * in the plugin directory.
 *
 * @return string Filepath to the src directory.
 * @since 2.0.0
 */
function get_plugin_src_file_path() {
	return plugin_dir_path( __DIR__ );
}
