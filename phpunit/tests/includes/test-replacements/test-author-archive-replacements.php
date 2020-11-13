<?php
/**
 * Test Replacement: Author Archive
 *
 * Test that the right sidebar is selected
 * for the Author Archive (Single & All)
 * conditions.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Frontend as Frontend;
use ECS\Data as Data;

/**
 * Class ECS_Author_Archive_Replacement
 */
class ECS_Test_Author_Archive_Replacements extends WP_UnitTestCase {
	/**
	 * Author Archive All: Test Single Replacement.
	 */
	public function test_replacement_all_archives_single() {
		$user       = self::factory()->user->create();
		$sidebar_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Single Sidebar',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 0,
							'data_type'       => 'author_archive_all',
							'attachment_type' => 'template_hierarchy',
						],
					],
				],
			]
		);

		$context     = 'is_author';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->go_to( get_author_posts_url( $user ) );

		$this->assertTrue(
			is_author(),
			true
		);

		$this->assertEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_id )
		);
	}

	/**
	 * Author Archive All: Test Multiple Replacement.
	 */
	public function test_replacement_all_archives_multiple() {
		$user           = self::factory()->user->create();
		$sidebar_one_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Alpha',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 0,
							'data_type'       => 'author_archive_all',
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
							'data_type'       => 'author_archive_all',
							'attachment_type' => 'template_hierarchy',
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

		$this->go_to( get_author_posts_url( $user ) );

		$this->assertTrue(
			is_author(),
			true
		);

		$context     = 'is_author';
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

	/**
	 * Author Archive Specific: Test Single Replacement.
	 */
	public function test_replacement_specific_archive_single() {
		$user_one   = self::factory()->user->create();
		$user_two   = self::factory()->user->create();
		$sidebar_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Single Sidebar',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => $user_one,
							'data_type'       => 'user',
							'attachment_type' => 'author_archive',
						],
					],
				],
			]
		);

		$this->go_to( get_author_posts_url( $user_one ) );

		$this->assertTrue(
			is_author(),
			true
		);

		$context     = 'is_author';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertEquals(
			$replacement,
			Data\get_sidebar_id( $sidebar_id )
		);
	}

	/**
	 * Author Archive All: Test Multiple Replacement.
	 */
	public function test_replacement_specific_archive_multiple() {
		$user_one       = self::factory()->user->create();
		$user_two       = self::factory()->user->create();
		$sidebar_one_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Alpha',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => $user_one,
							'data_type'       => 'user',
							'attachment_type' => 'author_archive',
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
							'id'              => $user_one,
							'data_type'       => 'user',
							'attachment_type' => 'author_archive',
						],
					],
				],
			]
		);

		$sidebar_three_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Sidebar Archive All',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 0,
							'data_type'       => 'author_archive_all',
							'attachment_type' => 'template_hierarchy',
						],
					],
				],
			]
		);

		$this->go_to( get_author_posts_url( $user_one ) );

		$this->assertTrue(
			is_author(),
			true
		);

		$context     = 'is_author';
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
