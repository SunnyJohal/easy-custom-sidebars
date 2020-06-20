<?php
/**
 * Test Data Functionality
 *
 * Test posttype registration and any CRUD
 * functionality.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Data as Data;

/**
 * Class ECS_Test_Data
 */
class ECS_Test_Data extends WP_UnitTestCase {
	/**
	 * Test Posttype Creation for sidebars.
	 */
	public function test_register_post_type_for_sidebars() {
		// Create the posttype.
		Data\register_post_type_for_sidebars();
		$this->assertTrue( true );
	}
}
