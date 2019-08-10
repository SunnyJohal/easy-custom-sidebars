<?php
/**
 * Class ECS_Test_Plugin_Includes
 *
 * @package Easy_Custom_Sidebars
 */
class ECS_Test_Plugin_Includes extends WP_UnitTestCase {
	public function test_get_plugin_data() {
		$plugin_file = dirname( dirname( dirname( __FILE__ ) ) ) . '/easy-custom-sidebars.php';
		$plugin_data = get_plugin_data( $plugin_file );

		$default_headers = array(
			'Name'        => 'Easy Custom Sidebars',
			'PluginURI'   => 'https://wordpress.org/plugins/easy-custom-sidebars/',
			'Description' => 'Replace any sidebar/widget area in any WordPress theme (no coding required).',
			'Author'      => 'Titanium Themes',
			'AuthorURI'   => 'https://titaniumthemes.com',
			'Version'     => '2.0.0',
			'TextDomain'  => 'easy-custom-sidebars',
			'DomainPath'  => '/languages',
		);

		$this->assertTrue(
			is_array( $plugin_data ),
			'Plugin data should be an array'
		);
	}
}

