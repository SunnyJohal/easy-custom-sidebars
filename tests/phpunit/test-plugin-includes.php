<?php
/**
 * Class ECS_Test_Plugin_Includes
 *
 * @package Easy_Custom_Sidebars
 */
class ECS_Test_Plugin_Includes extends WP_UnitTestCase {
	/**
	 * Runs before each test.
	 */
	public function setUp() {
		$this->plugin_file_path = dirname( dirname( dirname( __FILE__ ) ) ) . '/easy-custom-sidebars.php';
		$this->plugin_data      = get_plugin_data( $this->plugin_file_path );
	}

	/**
	 * Runs after each test.
	 */
	public function tearDown() {
		unset( $this->plugin_data );
	}

	/**
	 * Make sure main plugin file is present.
	 */
	public function test_plugin_file_exists() {
		$this->assertFileExists( $this->plugin_file_path );
	}

	/**
	 * Get Plugin Data.
	 */
	public function test_get_plugin_data() {
		$this->assertTrue(
			is_array( $this->plugin_data ),
			'Plugin data should be an array'
		);
	}

	/**
	 * Check Plugin Meta Data
	 *
	 * @param string $meta_key Array key for plugin data.
	 * @param string $expected Array key for plugin data.
	 *
	 * @dataProvider provide_plugin_metadata()
	 */
	public function test_plugin_metadata( $meta_key, $expected ) {
		$this->assertArrayHasKey(
			$meta_key,
			$this->plugin_data,
			"Plugin data array should have the {$meta_key} property set."
		);

		$this->assertContains(
			$expected,
			$this->plugin_data[ $meta_key ],
			"Plugin data property {$meta_key} does not match the test data."
		);
	}

	/**
	 * Plugin Metadata Data Provider
	 */
	public function provide_plugin_metadata() {
		return [
			[ 'Name', 'Easy Custom Sidebars' ],
			[ 'Description', 'Replace any sidebar/widget area in any WordPress theme (no coding required).' ],
			[ 'Version', '2.0.0' ],
			[ 'Author', 'Titanium Themes' ],
			[ 'AuthorURI', 'https://titaniumthemes.com' ],
			[ 'PluginURI', 'https://wordpress.org/plugins/easy-custom-sidebars/' ],
			[ 'TextDomain', 'easy-custom-sidebars' ],
		];
	}
}

