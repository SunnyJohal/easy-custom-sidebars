<?php
/**
 * Test Replacement: Taxonomy Term
 *
 * Test that the right sidebar is selected
 * for a specific Taxonomy Term condition.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Frontend as Frontend;
use ECS\Data as Data;

/**
 * Class ECS_Test_Taxonomy_Term_Replacement
 */
class ECS_Test_Taxonomy_Term_Replacement extends WP_UnitTestCase {
	/**
	 * Test Single Replacement.
	 */
	public function test_replacement_single() {
		$tax_terms    = self::factory()->category->create_many( 10 );
		$test_term_id = $tax_terms[1];

		$sidebar_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Single Sidebar',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => $test_term_id,
							'data_type'       => 'category',
							'attachment_type' => 'taxonomy',
						],
					],
				],
			]
		);

		$this->go_to( get_term_link( $test_term_id ) );

		$context     = 'is_taxonomy';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			is_category(),
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
	public function ignore_test_replacement_multiple() {
		$tax_terms      = self::factory()->category->create_many( 10 );
		$test_term_id   = $tax_terms[1];
		$sidebar_one_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Alpha',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 0,
							'data_type'       => 'category',
							'attachment_type' => 'taxonomy_all',
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
							'data_type'       => 'category',
							'attachment_type' => 'taxonomy_all',
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

		$this->go_to( get_term_link( $test_term_id ) );

		$context     = 'is_taxonomy';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			is_category(),
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
