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
		self::$sidebar_id = $factory->post->create( [ 'post_type' => 'sidebar_instance' ] );
		self::$post_id    = $factory->post->create( [ 'post_type' => 'post' ] );
		self::$page_id    = $factory->post->create( [ 'post_type' => 'page' ] );
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
}
