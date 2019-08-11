<?php
/**
 * Test Plugin Data
 *
 * @package Easy_Custom_Sidebars
 */

/**
 * Class ECS_Test_Plugin_Includes
 */
class ECS_Test_Plugin_Includes extends WP_UnitTestCase {
	/**
	 * Runs before each test.
	 */
	public function setUp() {
		$this->plugin_file_path = dirname( dirname( dirname( __DIR__ ) ) ) . '/easy-custom-sidebars.php';
	}

	/**
	 * Runs after each test.
	 */
	public function tearDown() {
		unset( $this->plugin_file_path );
	}

	/**
	 * Make sure main plugin file is present.
	 */
	public function test_plugin_file_exists() {
		$this->assertFileExists( $this->plugin_file_path );
	}

	/**
	 * Test single file loader.
	 *
	 * @param string $file_name File name without the .php suffix.
	 * @param string $message Displayed if the test fails.
	 *
	 * @dataProvider provide_valid_file_names()
	 */
	public function test_load_file( $file_name, $message ) {
		$file_loaded = ECS\load_file( $file_name );

		$this->assertTrue(
			$file_loaded,
			$message
		);

		$this->assertFalse(
			is_wp_error( ECS\load_file( $file_name ) ),
			$message
		);
	}

	/**
	 * Provide Valid Filenames.
	 *
	 * Provides all of the filename slugs that
	 * are expected to load when the plugin runs.
	 */
	public function provide_valid_file_names() {
		return [
			[ 'admin', 'Should load /src/includes/admin.php' ],
			[ 'api', 'Should load /src/includes/api.php' ],
			[ 'customizer', 'Should load /src/includes/customizer.php' ],
			[ 'data', 'Should load /src/includes/data.php' ],
			[ 'frontend', 'Should load /src/includes/frontend.php' ],
		];
	}

	/**
	 * Test invalid single file loader.
	 */
	public function test_load_invalid_file() {
		$file_loaded = ECS\load_file( 'random-filename' );
		$this->assertTrue(
			is_wp_error( $file_loaded )
		);
	}

	/**
	 * Test Load All Plugin Files
	 *
	 * Ensures that all of the plugin files
	 * are loaded when the plugin is ran.
	 */
	public function test_load_all_plugin_files() {
		$this->assertTrue(
			ECS\load_all_plugin_files(),
			'Should load all of the plugin files'
		);
	}
}

