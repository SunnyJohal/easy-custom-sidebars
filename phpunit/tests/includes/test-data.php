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
	 * Runs the routine before each test is executed.
	 */
	public function setUp() {
		parent::setUp();

		global $wp_rest_server;
		$wp_rest_server = new Spy_REST_Server();
		do_action( 'rest_api_init', $wp_rest_server );
	}

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
	 * Test Posttype Creation for sidebars.
	 */
	public function test_register_post_type_for_sidebars() {
		$this->assertTrue(
			post_type_exists( 'sidebar_instance' ),
			'Failed to register the post type.'
		);
	}

	/**
	 * Test Posttype supported features.
	 */
	public function test_supported_features() {
		$this->assertTrue(
			post_type_supports( 'sidebar_instance', 'title' ),
			'Sidebar instance needs to opt in for title support'
		);

		$this->assertTrue(
			post_type_supports( 'sidebar_instance', 'custom-fields' ),
			'Sidebar post type needs to opt in for custom field support'
		);
	}

	/**
	 * Test Get Sidebar ID
	 */
	public function test_get_sidebar_id() {
		$sidebar_id = Data\get_sidebar_id( self::$post_id );

		$this->assertEquals(
			$sidebar_id,
			'ecs-sidebar-' . self::$post_id
		);
	}

	/**
	 * Test Get Sidebar Description
	 */
	public function test_get_sidebar_description() {
		$description = 'This is an example sidebar description';
		update_post_meta( self::$post_id, 'sidebar_description', $description );

		// Valid sidebar id.
		$this->assertEquals(
			Data\get_sidebar_description( self::$post_id ),
			$description
		);

		// Invalid sidebar id.
		$this->assertEquals(
			Data\get_sidebar_description( 0 ),
			false
		);
	}

	/**
	 * Test Get Sidebar Description.
	 */
	public function test_get_sidebar_attachments() {
		// Test case: no attachments exist.
		$this->assertEmpty(
			Data\get_sidebar_attachments( self::$post_id )
		);

		$this->assertIsArray(
			Data\get_sidebar_attachments( self::$post_id )
		);

		// Sidebar with attachments.
	}
}
