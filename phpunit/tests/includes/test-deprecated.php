<?php
/**
 * Test Deprecated Functionality
 *
 * Tests any backwards compatibility requirements.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Data as Data;
use ECS\Deprecated as Deprecated;

/**
 * Class ECS_Test_Deprecated
 */
class ECS_Test_Deprecated extends WP_UnitTestCase {
	/**
	 * ID of sidebar instance.
	 *
	 * @var int $post_id
	 */
	protected static $post_id;

	/**
	 * Setup before class tests are run.
	 *
	 * @param object $factory Factory obj for generating WordPress fixtures.
	 */
	public function wpSetUpBeforeClass( $factory ) {
		self::$post_id = $factory->post->create( [ 'post_type' => 'sidebar_instance' ] );
	}

	/**
	 * Test Get Sidebar ID
	 */
	public function test_get_sidebar_id() {
		add_post_meta( self::$post_id, 'sidebar_id', 'legacy-sidebar-id-1' );

		$sidebar_id = Data\get_sidebar_id( self::$post_id );

		$this->assertEquals(
			$sidebar_id,
			'legacy-sidebar-id-1',
			'Legacy sidebars should preserve the generated sidebar id.'
		);

		$this->assertNotEquals(
			$sidebar_id,
			'ecs-sidebar-' . self::$post_id,
			'Legacy sidebars should returned the saved sidebar_id meta value.'
		);
	}
}
