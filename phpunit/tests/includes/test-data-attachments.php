<?php
/**
 * Test Data Attachment Functionality
 *
 * Test any data relating to sidebar attachments.
 *
 * @package Easy_Custom_Sidebars
 */

use ECS\Data as Data;

/**
 * Class ECS_Test_Data
 */
class ECS_Test_Data_Attachments extends WP_UnitTestCase {
	/**
	 * ID of sidebar instance.
	 *
	 * @var int $sidebar_id
	 */
	protected static $sidebar_id;

	/**
	 * ID of test post created.
	 *
	 * @var int $post_id
	 */
	protected static $post_id;

	/**
	 * ID of test page created.
	 *
	 * @var int $page_id
	 */
	protected static $page_id;

	/**
	 * ID of test product created.
	 *
	 * @var int $page_id
	 */
	protected static $taxonomy_term_id;

	/**
	 * ID of temp user created for tests.
	 *
	 * @var int $user_id
	 */
	protected static $user_id;

	/**
	 * Setup before any class tests are run.
	 *
	 * @param object $factory Factory obj for generating WordPress fixtures.
	 */
	public static function wpSetUpBeforeClass( $factory ) {
		self::$sidebar_id       = $factory->post->create( [ 'post_type' => 'sidebar_instance' ] );
		self::$post_id          = $factory->post->create( [ 'post_type' => 'post' ] );
		self::$page_id          = $factory->post->create( [ 'post_type' => 'page' ] );
		self::$taxonomy_term_id = $factory->category->create( [ 'name' => 'Category Name' ] );
		self::$user_id          = $factory->user->create();
	}

	/**
	 * Clean up after all class tests are run.
	 */
	public static function wpTearDownAfterClass() {
		wp_delete_post( self::$sidebar_id, true );
		wp_delete_post( self::$post_id, true );
		wp_delete_post( self::$page_id, true );
	}

	/**
	 * After a test method runs, reset any state
	 * in WordPress the test method might have
	 * changed.
	 */
	public function tearDown() {
		delete_post_meta( self::$sidebar_id, 'sidebar_attachments' );
		parent::tearDown();
	}

	/**
	 * Test attachments: Page.
	 */
	public function test_page_attachment() {
		$attachments = [
			[
				'id'              => self::$page_id,
				'data_type'       => 'page',
				'attachment_type' => 'post_type',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			$this->assertEquals(
				get_the_title( self::$page_id ),
				$attachment['title']
			);

			$this->assertEquals(
				'Page',
				$attachment['label']
			);

			$this->assertEquals(
				get_page_link( self::$page_id ),
				$attachment['link']
			);
		}
	}

	/**
	 * Test attachments: Post.
	 */
	public function test_post_attachment() {
		$attachments = [
			[
				'id'              => self::$post_id,
				'data_type'       => 'post',
				'attachment_type' => 'post_type',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			$this->assertEquals(
				get_the_title( self::$post_id ),
				$attachment['title']
			);

			$this->assertEquals(
				'Post',
				$attachment['label']
			);

			$this->assertEquals(
				get_page_link( self::$post_id ),
				$attachment['link']
			);
		}
	}

	/**
	 * Test attachments: Post Type All.
	 */
	public function test_post_type_all_attachment() {
		$attachments = [
			[
				'id'              => 1,
				'data_type'       => 'post',
				'attachment_type' => 'post_type_all',
			],
			[
				'id'              => 1,
				'data_type'       => 'page',
				'attachment_type' => 'post_type_all',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			// Test Post.
			if ( 'post' === $attachment['data_type'] ) {
				$this->assertEquals(
					'All Posts',
					$attachment['title']
				);

				$this->assertEquals(
					'Posts',
					$attachment['label']
				);

				$this->assertEquals(
					get_admin_url( null, 'edit.php?post_type=post' ),
					$attachment['link']
				);
			}

			// Test Page.
			if ( 'page' === $attachment['data_type'] ) {
				$this->assertEquals(
					'All Pages',
					$attachment['title']
				);

				$this->assertEquals(
					'Pages',
					$attachment['label']
				);

				$this->assertEquals(
					get_admin_url( null, 'edit.php?post_type=page' ),
					$attachment['link']
				);
			}
		}
	}

	/**
	 * Test attachments: Post Type Archive.
	 */
	public function test_post_type_archive_attachment() {
		$attachments = [
			[
				'id'              => 1,
				'data_type'       => 'post',
				'attachment_type' => 'post_type_archive',
			],
			[
				'id'              => 1,
				'data_type'       => 'missing-posttype',
				'attachment_type' => 'post_type_archive',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			if ( 'post' === $attachment['data_type'] ) {
				$this->assertEquals(
					'Posts Archive',
					$attachment['title']
				);

				$this->assertEquals(
					'Posts Archive',
					$attachment['label']
				);

				$this->assertEquals(
					get_admin_url( null, 'edit.php?post_type=post' ),
					$attachment['link']
				);
			}

			if ( 'missing-posttype' === $attachment['data_type'] ) {
				$this->assertEquals(
					'(Not Found)',
					$attachment['title']
				);

				$this->assertEquals(
					'Deleted',
					$attachment['label']
				);

				$this->assertEquals(
					site_url(),
					$attachment['link']
				);
			}
		}
	}

	/**
	 * Test attachments: Post Type Archive.
	 */
	public function test_taxonomy_attachment() {
		$term = get_term( self::$taxonomy_term_id, 'category' );

		$attachments = [
			[
				'id'              => $term->term_id,
				'data_type'       => 'category',
				'attachment_type' => 'taxonomy',
			],
			[
				'id'              => $term->term_id,
				'data_type'       => 'invalidcategory',
				'attachment_type' => 'taxonomy',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			// Valid term.
			if ( 'category' === $attachment['data_type'] ) {
				$this->assertEquals(
					$term->name,
					$attachment['title']
				);

				$this->assertEquals(
					get_taxonomy( $term->taxonomy )->labels->singular_name,
					$attachment['label']
				);

				$this->assertEquals(
					get_term_link( $term->term_id ),
					$attachment['link']
				);
			}

			// Invalid term.
			if ( 'invalidcategory' === $attachment['data_type'] ) {
				$this->assertEquals(
					'(Not Found)',
					$attachment['title']
				);

				$this->assertEquals(
					'Deleted',
					$attachment['label']
				);

				$this->assertEquals(
					site_url(),
					$attachment['link']
				);
			}
		}
	}

	/**
	 * Test attachments: Taxonomy All.
	 */
	public function test_taxonomy_all_attachment() {
		$attachments = [
			[
				'id'              => 1,
				'data_type'       => 'category',
				'attachment_type' => 'taxonomy_all',
			],
			[
				'id'              => 1,
				'data_type'       => 'invalidtaxonomy',
				'attachment_type' => 'taxonomy_all',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			if ( 'category' === $attachment['data_type'] ) {
				$this->assertEquals(
					'All Categories',
					$attachment['title']
				);

				$this->assertEquals(
					'All Categories',
					$attachment['label']
				);

				$this->assertEquals(
					get_admin_url( null, 'edit-tags.php?taxonomy=category' ),
					$attachment['link']
				);
			}

			if ( 'invalidtaxonomy' === $attachment['data_type'] ) {
				$this->assertEquals(
					'(Not Found)',
					$attachment['title']
				);

				$this->assertEquals(
					'Deleted',
					$attachment['label']
				);

				$this->assertEquals(
					site_url(),
					$attachment['link']
				);
			}
		}
	}

	/**
	 * Test attachments: Category Posts.
	 */
	public function test_category_posts_attachment() {
		$term = get_term( self::$taxonomy_term_id, 'category' );

		$attachments = [
			[
				'id'              => $term->term_id,
				'data_type'       => 'category',
				'attachment_type' => 'category_posts',
			],
			[
				'id'              => $term->term_id,
				'data_type'       => 'invalidcategory',
				'attachment_type' => 'category_posts',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			if ( 'category' === $attachment['data_type'] ) {
				$this->assertEquals(
					$term->name,
					$attachment['title']
				);

				$this->assertEquals(
					'All Posts In Category',
					$attachment['label']
				);

				$this->assertEquals(
					get_admin_url( null, "edit.php?taxonomy={$term->slug}" ),
					$attachment['link']
				);
			}

			if ( 'invalidtaxonomy' === $attachment['data_type'] ) {
				$this->assertEquals(
					'(Not Found)',
					$attachment['title']
				);

				$this->assertEquals(
					'Deleted',
					$attachment['label']
				);

				$this->assertEquals(
					site_url(),
					$attachment['link']
				);
			}
		}
	}

	/**
	 * Test attachments: Category Posts.
	 */
	public function test_author_archive_attachment() {
		$user = get_userdata( self::$user_id );

		$attachments = [
			[
				'id'              => self::$user_id,
				'data_type'       => 'user',
				'attachment_type' => 'author_archive',
			],
			[
				'id'              => 'invalid',
				'data_type'       => 'user',
				'attachment_type' => 'author_archive',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			if ( self::$user_id === $attachment['id'] ) {
				$this->assertEquals(
					$user->display_name,
					$attachment['title']
				);

				$this->assertEquals(
					'Author Archive',
					$attachment['label']
				);

				$this->assertEquals(
					get_author_posts_url( self::$user_id ),
					$attachment['link']
				);
			}

			if ( 0 === $attachment['id'] ) {
				$this->assertEquals(
					'(Not Found)',
					$attachment['title']
				);

				$this->assertEquals(
					'Deleted',
					$attachment['label']
				);

				$this->assertEquals(
					site_url(),
					$attachment['link']
				);
			}
		}
	}

	/**
	 * Test attachments: Template Hierarchy
	 */
	public function test_template_hierarchy_attachment() {
		$attachments = [
			[
				'id'              => 0,
				'data_type'       => '404',
				'attachment_type' => 'template_hierarchy',
			],
			[
				'id'              => 0,
				'data_type'       => 'author_archive_all',
				'attachment_type' => 'template_hierarchy',
			],
			[
				'id'              => 0,
				'data_type'       => 'index_page',
				'attachment_type' => 'template_hierarchy',
			],
			[
				'id'              => 0,
				'data_type'       => 'date_archive',
				'attachment_type' => 'template_hierarchy',
			],
			[
				'id'              => 0,
				'data_type'       => 'search_results',
				'attachment_type' => 'template_hierarchy',
			],
		];

		add_post_meta( self::$sidebar_id, 'sidebar_attachments', $attachments );
		$saved_attachments = Data\get_sidebar_attachments( self::$sidebar_id, true );

		foreach ( $saved_attachments as $attachment ) {
			$this->assertArrayHasKey( 'id', $attachment );
			$this->assertArrayHasKey( 'data_type', $attachment );
			$this->assertArrayHasKey( 'attachment_type', $attachment );
			$this->assertArrayHasKey( 'title', $attachment );
			$this->assertArrayHasKey( 'label', $attachment );
			$this->assertArrayHasKey( 'link', $attachment );

			// Common fields.
			$this->assertEquals(
				'Template',
				$attachment['label']
			);

			$this->assertEquals(
				get_admin_url( null, 'edit.php?post_type=page' ),
				$attachment['link']
			);

			// 404.
			if ( '404' === $attachment['data_type'] ) {
				$this->assertEquals(
					'404 (Page Not Found)',
					$attachment['title']
				);
			}

			// Author archive all.
			if ( 'author_archive_all' === $attachment['data_type'] ) {
				$this->assertEquals(
					'Author Archive',
					$attachment['title']
				);
			}

			// Index page.
			if ( 'index_page' === $attachment['data_type'] ) {
				$this->assertEquals(
					'Blog Index Page',
					$attachment['title']
				);
			}

			// Date archive.
			if ( 'date_archive' === $attachment['data_type'] ) {
				$this->assertEquals(
					'Date Archive',
					$attachment['title']
				);
			}

			// Search archive.
			if ( 'search_results' === $attachment['data_type'] ) {
				$this->assertEquals(
					'Search Results',
					$attachment['title']
				);
			}
		}
	}

	/**
	 * Test attachments: Template Hierarchy Page Templates
	 * @todo register page templates test.
	 */
	public function ignore_test_template_hierarchy_page_templates_attachment() {
		$attachments = [
			[
				'id'              => 0,
				'data_type'       => 'page-template-templates/template-cover.php',
				'attachment_type' => 'template_hierarchy',
			],
		];
	}
}
