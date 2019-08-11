<?php
/**
 * Plugin Name: Easy Custom Sidebars
 * Description: Replace any sidebar/widget area in any WordPress theme (no coding required).
 * Version: 2.0.0
 * Author: Titanium Themes
 * Author URI: https://titaniumthemes.com
 * Plugin URI: https://wordpress.org/plugins/easy-custom-sidebars/
 * Text Domain: easy-custom-sidebars
 * License: GPL2
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package     Easy_Custom_Sidebars
 * @author      Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 * @license     GPL-2.0+
 * @copyright   Copyright (c) 2019, Titanium Themes
 * @version     2.0.0
 */

namespace ECS;

// Prevent direct file access.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Start up the plugin.
load_all_plugin_files();

/**
 * Load All Plugin Files
 *
 * Loads all of the required files for this
 * plugin to function.
 *
 * @throws WP_Error Error message if and file was not found.
 * @since 2.0.0
 */
function load_all_plugin_files() {
	$files_loaded = array_map(
		__NAMESPACE__ . '\load_file',
		[
			'admin',
			'customizer',
			'frontend',
			'posttype',
			'rest-api',
		]
	);

	// Make sure no errors exist.
	return ! in_array(
		true,
		array_map( 'is_wp_error', $files_loaded ),
		true
	);
}

/**
 * Load Single File
 *
 * Attempts to locate a single php file
 * from the src/includes directory.
 *
 * @param string $file_name File name slug without the .php suffix.
 * @return boolean|WP_Error True if file was located | Error if file not found.
 *
 * @since 2.0.0
 */
function load_file( $file_name ) {
	$file = plugin_dir_path( __FILE__ ) . "src/includes/{$file_name}.php";

	if ( file_exists( $file ) ) {
		include_once $file;
		return true;
	}

	// Return a WP_Error if the file was not located.
	return new \WP_Error(
		'file_not_found',
		sprintf(
			/* translators: plugin include file error path. */
			__( 'Could not locate the plugin file: %s', 'easy-custom-sidebars' ),
			$file
		)
	);
}
