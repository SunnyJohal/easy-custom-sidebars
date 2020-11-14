<?php
/**
 * Test Replacement: Posttype Archive Replacement
 *
 * Test that the right sidebar is selected
 * for the all posttype archive condition.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Frontend as Frontend;
use ECS\Data as Data;

/**
 * Class ECS_Test_Posttype_Archive_Replacement
 */
class ECS_Test_Posttype_Archive_Replacement extends WP_UnitTestCase {
	/**
	 * Setup before class tests are run.
	 *
	 * @param object $factory Factory obj for generating WordPress fixtures.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		// Register posttype for tests.
		register_post_type(
			'ecs_test_posttype',
			[ 'has_archive' => true ]
		);
	}

	/**
	 * Test Single Replacement.
	 */
	public function test_replacement_single() {
		$sidebar_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Single Sidebar',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 1,
							'data_type'       => 'ecs_test_posttype',
							'attachment_type' => 'post_type_archive',
						],
					],
				],
			]
		);

		$this->go_to( get_post_type_archive_link( 'ecs_test_posttype' ) );

		$context     = 'is_post_type_archive';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			post_type_exists( 'ecs_test_posttype' ),
			true
		);

		$this->assertTrue(
			is_post_type_archive( 'ecs_test_posttype' ),
			true
		);

		$this->assertEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_id )
		);
	}
}
