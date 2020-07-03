<?php
/**
 * Test Frontend Functionality
 *
 * Tests any backwards compatibility requirements.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Frontend as Frontend;

/**
 * Class ECS_Test_Frontend
 */
class ECS_Test_Frontend extends WP_UnitTestCase {
	/**
	 * Test registered_sidebars_exist()
	 */
	public function test_registered_sidebars_exist() {
		global $wp_registered_sidebars;
		$wp_registered_sidebars_copy = $wp_registered_sidebars;

		// Remove sidebars and test.
		$wp_registered_sidebars = [];
		$this->assertNotEquals(
			Frontend\registered_sidebars_exist(),
			true
		);

		// Restore sidebars and test.
		$wp_registered_sidebars = $wp_registered_sidebars_copy;
		$this->assertEquals(
			Frontend\registered_sidebars_exist(),
			true
		);
	}
}
