<?php
/**
 * Test Replacement: Search Results Page
 *
 * Test that the right sidebar is selected
 * for the search results page context.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Frontend as Frontend;
use ECS\Data as Data;

/**
 * Class ECS_Test_Search_Replacement
 */
class ECS_Test_Search_Replacement extends WP_UnitTestCase {
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
							'id'              => 0,
							'data_type'       => 'search_results',
							'attachment_type' => 'template_hierarchy',
						],
					],
				],
			]
		);

		$context     = 'is_search';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_id )
		);
	}

	/**
	 * Test Multiple Replacements.
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
							'id'              => 0,
							'data_type'       => 'search_results',
							'attachment_type' => 'template_hierarchy',
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
							'id'              => 0,
							'data_type'       => 'search_results',
							'attachment_type' => 'template_hierarchy',
						],
					],
				],
			]
		);

		$sidebar_three_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Empty Attachments',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [],
				],
			]
		);

		$context     = 'is_search';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

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
