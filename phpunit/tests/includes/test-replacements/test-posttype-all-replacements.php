<?php
/**
 * Test Replacement: Posttype All Replacement
 *
 * Test that the right sidebar is selected
 * for the all posttype posts condition.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Frontend as Frontend;
use ECS\Data as Data;

/**
 * Class ECS_Test_Posttype_All_Replacement
 */
class ECS_Test_Posttype_All_Replacement extends WP_UnitTestCase {
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
							'data_type'       => 'post',
							'attachment_type' => 'post_type_all',
						],
					],
				],
			]
		);

		$test_post = self::factory()->post->create();
		$this->go_to( get_post_permalink( $test_post ) );

		$context     = 'is_single';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			is_singular(),
			true
		);

		$this->assertEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_id )
		);
	}

	/**
	 * Test Single Replacement for Pages.
	 */
	public function test_replacement_page_single() {
		$sidebar_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Single Sidebar',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 1,
							'data_type'       => 'page',
							'attachment_type' => 'post_type_all',
						],
					],
				],
			]
		);

		$test_post = self::factory()->post->create( [ 'post_type' => 'page' ] );
		$this->go_to( get_post_permalink( $test_post ) );

		$context     = 'is_page';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			is_singular(),
			true
		);

		$this->assertEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_id )
		);
	}

	/**
	 * Test Multiple Replacement.
	 */
	public function test_replacement_multiple() {
		$sidebar_one_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Alpha',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 1,
							'data_type'       => 'post',
							'attachment_type' => 'post_type_all',
						],
					],
				],
			]
		);

		$sidebar_two_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Bravo',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 1,
							'data_type'       => 'post',
							'attachment_type' => 'post_type_all',
						],
					],
				],
			]
		);

		$sidebar_three_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Post Archive',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [],
				],
			]
		);

		$test_post = self::factory()->post->create();
		$this->go_to( get_post_permalink( $test_post ) );

		$context     = 'is_single';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			is_singular(),
			true
		);

		$this->assertEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_two_id )
		);

		$this->assertNotEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_one_id )
		);

		$this->assertNotEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_three_id )
		);
	}
}
