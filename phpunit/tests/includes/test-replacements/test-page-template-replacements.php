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
 * Class ECS_Test_Page_Template_Replacements
 */
class ECS_Test_Page_Template_Replacements extends WP_UnitTestCase {
	/**
	 * ID of sidebar instance.
	 *
	 * @var string $sidebar_id
	 */
	protected static $template_slug;

	/**
	 * Setup before any class tests are run.
	 *
	 * @param object $factory Factory obj for generating WordPress fixtures.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$template_slug = 'templates/template-cover.php';

		add_filter(
			'theme_templates',
			function( $post_templates, $theme_obj, $post, $post_type ) {
				return [
					'templates/template-cover.php'      => 'Cover Template',
					'templates/template-full-width.php' => 'Full Width Template',
				];
			},
			10,
			4
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
							'id'              => 0,
							'data_type'       => 'page-template-' . self::$template_slug,
							'attachment_type' => 'template_hierarchy',
						],
					],
				],
			]
		);

		$test_post = self::factory()->post->create(
			[
				'post_type'  => 'page',
				'meta_input' => [
					'_wp_page_template' => self::$template_slug,
				],
			]
		);

		$this->go_to( get_permalink( $test_post ) );

		$context     = 'is_page';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			is_page(),
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
	public function stest_replacement_multiple() {
		$sidebar_one_id = self::factory()->post->create(
			[
				'post_type'  => 'sidebar_instance',
				'post_title' => 'Alpha',
				'meta_input' => [
					'sidebar_replacement_id' => 'example_sidebar',
					'sidebar_attachments'    => [
						[
							'id'              => 0,
							'data_type'       => 'page-template-' . self::$template_slug,
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
							'data_type'       => 'page-template-' . self::$template_slug,
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

		$test_post = self::factory()->post->create(
			[
				'post_type'  => 'page',
				'meta_input' => [
					'_wp_page_template' => self::$template_slug,
				],
			]
		);

		$this->go_to( get_permalink( $test_post ) );

		$context     = 'is_page';
		$replacement = Frontend\get_widget_area_replacement_id( 'example_sidebar', $context );

		$this->assertTrue(
			is_page(),
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
