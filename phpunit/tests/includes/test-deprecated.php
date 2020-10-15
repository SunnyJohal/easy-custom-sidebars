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
	public static function wpSetUpBeforeClass( $factory ) {
		self::$post_id = $factory->post->create( [ 'post_type' => 'sidebar_instance' ] );
	}

	/**
	 * Test Get Sidebar
	 */
	public function test_get_sidebar_attachments() {
		$legacy_fields = [
			'menu-item-db-id',
			'menu-item-object-id',
			'menu-item-object',
			'menu-item-parent-id',
			'menu-item-position',
			'menu-item-type',
		];

		// Example attachments in legacy format.
		$attachments = [
			[
				'menu-item-db-id'     => 1,
				'menu-item-object-id' => 1,
				'menu-item-object'    => 'post',
				'menu-item-parent-id' => 0,
				'menu-item-position'  => 0,
				'menu-item-type'      => 'post_type',
			],
			[
				'menu-item-db-id'     => 1,
				'menu-item-object-id' => 1,
				'menu-item-object'    => 'post',
				'menu-item-parent-id' => 0,
				'menu-item-position'  => 0,
				'menu-item-type'      => 'post_type_all',
			],
			[
				'menu-item-db-id'     => 15,
				'menu-item-object-id' => 15,
				'menu-item-object'    => 'category',
				'menu-item-parent-id' => 0,
				'menu-item-position'  => 0,
				'menu-item-type'      => 'category_posts',
			],
		];

		add_post_meta( self::$post_id, 'sidebar_attachments', $attachments );

		$saved_attachments = Data\get_sidebar_attachments( self::$post_id );

		foreach ( $saved_attachments as $attachment ) {
			// menu-item-object-id is now id.
			$this->assertArrayHasKey( 'id', $attachment );

			// menu-item-object is now data_type.
			$this->assertArrayHasKey( 'data_type', $attachment );

			// menu-item-type is now attachment_type.
			$this->assertArrayHasKey( 'attachment_type', $attachment );

			// Make sure legacy fields aren't present.
			$this->assertArrayNotHasKey( 'menu-item-db-id', $attachment );
			$this->assertArrayNotHasKey( 'menu-item-object-id', $attachment );
			$this->assertArrayNotHasKey( 'menu-item-object', $attachment );
			$this->assertArrayNotHasKey( 'menu-item-parent-id', $attachment );
			$this->assertArrayNotHasKey( 'menu-item-position', $attachment );
			$this->assertArrayNotHasKey( 'menu-item-type', $attachment );
		}
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
