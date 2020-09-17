<?php
/**
 * Test Data Attachment Functionality
 *
 * Test any data relating to sidebar attachments.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Data as Data;

/**
 * Class ECS_Test_Data
 */
class ECS_Test_Data_Attachments extends WP_UnitTestCase {
	/**
	 * ID of sidebar instance.
	 *
	 * @var int $post_id
	 */
	protected static $post_id;

	/**
	 * ID of temp user created for tests.
	 *
	 * @var int $user_id
	 */
	protected static $user_id;

	/**
	 * Setup before any class tests are run.
	 *
	 * @param object $factory Factory obj for generating WordPress fixtures.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$post_id = $factory->post->create( [ 'post_type' => 'sidebar_instance' ] );
	}

	/**
	 * Clean up after all class tests are run.
	 */
	public static function wpTearDownAfterClass() {
		wp_delete_post( self::$post_id, true );
	}

	/**
	 * Test attachments.
	 */
	public function test_attachment_migration() {
		$this->assertTrue( true );
	}
}
