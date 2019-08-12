<?php
/**
 * Test Setup Functionality
 *
 * Unit tests for functions defined in
 * src/includes/setup.php
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Setup as Setup;

/**
 * Class ECS_Test_Setup
 */
class ECS_Test_Setup extends WP_UnitTestCase {
	/**
	 * Test plugin file url method.
	 */
	public function test_get_plugin_src_url() {
		// Make sure the function returns something.
		$this->assertFalse(
			empty( Setup\get_plugin_src_url() ),
			'Should return the file path to the plugin.'
		);

		$this->assertContains(
			'/easy-custom-sidebars/src',
			Setup\get_plugin_src_url(),
			'URL should contain the src and plugin path. ' . Setup\get_plugin_src_url()
		);
	}

	/**
	 * Test plugin file path method.
	 */
	public function test_get_plugin_src_file_path() {
		// Make sure the function returns something.
		$this->assertFalse(
			empty( Setup\get_plugin_src_file_path() ),
			'Should return the file path to the plugin.'
		);

		// Make sure that the directory exists.
		$this->assertTrue(
			is_dir( Setup\get_plugin_src_file_path() ),
			'Should be a valid directory.'
		);
	}
}
