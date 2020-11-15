<?php
/**
 * Test Replacement: All Posts in Category
 *
 * Test that the right sidebar is selected
 * for the all category posts condition.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Frontend as Frontend;
use ECS\Data as Data;

/**
 * Class ECS_Test_Category_Post_Replacement
 */
class ECS_Test_Category_Post_Replacement extends WP_UnitTestCase {
	/**
	 * Test Single Replacement.
	 */
	public function test_replacement_single() {
		$test_category = self::factory()->category->create_and_get();
		$sidebar_id    = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Single Sidebar',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => $test_category->term_id,
							'data_type'       => 'category',
							'attachment_type' => 'category_posts',
						],
					],
				],
			]
		);

		$test_post = self::factory()->post->create(
			[
				'post_category' => [ $test_category->term_id ],
			]
		);
		$this->go_to( get_post_permalink( $test_post ) );

		$this->assertTrue(
			has_category( $test_category->term_id, $test_post ),
			true
		);

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
	 * Test Multiple Replacement.
	 */
	public function test_replacement_multiple() {
		$test_category  = self::factory()->category->create_and_get();
		$sidebar_one_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Alpha',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => $test_category->term_id,
							'data_type'       => 'category',
							'attachment_type' => 'category_posts',
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
							'id'              => $test_category->term_id,
							'data_type'       => 'category',
							'attachment_type' => 'category_posts',
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

		$test_post = self::factory()->post->create(
			[
				'post_category' => [ $test_category->term_id ],
			]
		);
		$this->go_to( get_post_permalink( $test_post ) );

		$this->assertTrue(
			has_category( $test_category->term_id, $test_post ),
			true
		);

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
