<?php
/**
 * Data Structure Functionality
 *
 * Registers the posttype to represent the data
 * structure of the saved sidebars and contains
 * any CRUD logic.
 *
 * @package Easy_Custom_Sidebars
 * @author  Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 */

namespace ECS\Data;

/**
 * Register Posttype
 *
 * Registers a new post type to hold any custom
 * sidebars created.
 *
 * @since 2.0.0
 */
function register_post_type_for_sidebars() {
	register_post_type(
		'sidebar_instance',
		[
			'labels'                => [
				'name'          => __( 'Sidebars', 'easy-custom-sidebars' ),
				'singular_name' => __( 'Sidebar', 'easy-custom-sidebars' ),
			],
			'public'                => false,
			'hierarchical'          => false,
			'rewrite'               => false,
			'delete_with_user'      => false,
			'query_var'             => false,
			'show_in_rest'          => true,
			'rest_base'             => 'easy-custom-sidebars',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'supports'              => [
				'custom-fields',
				'title',
			],
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\\register_post_type_for_sidebars' );

/**
 * Register Meta
 *
 * Register metadata to indicate all of the areas
 * (posts/taxonomies/templates/archives etc) in
 * the site that this sidebar is replacing.
 *
 * @since 2.0.0
 */
function register_metadata_for_sidebars() {
	register_meta(
		'post',
		'sidebar_replacement_id',
		[
			'object_subtype'    => 'sidebar_instance',
			'type'              => 'string',
			'description'       => __( 'The unique identifier of the existing sidebar that this custom sidebar will replace.', 'easy-custom-sidebars' ),
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		]
	);

	register_meta(
		'post',
		'sidebar_description',
		[
			'object_subtype'    => 'sidebar_instance',
			'type'              => 'string',
			'description'       => __( 'Description of the sidebar, displayed in the Widgets interface.', 'easy-custom-sidebars' ),
			'single'            => true,
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		]
	);

	register_meta(
		'post',
		'sidebar_attachments',
		[
			'object_subtype' => 'sidebar_instance',
			'type'           => 'string',
			'single'         => true,
			'show_in_rest'   => [
				'schema' => [
					'items' => [
						'type'       => 'object',
						'properties' => [
							'attachment-id'     => [ 'type' => 'string' ],
							'attachment-object' => [ 'type' => 'string' ],
							'attachment-type'   => [ 'type' => 'string' ],
						],
					],
				],
			],
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\\register_metadata_for_sidebars' );

/**
 * Get Sidebar Id.
 *
 * Gets the unique identifier by which
 * the custom sidebar will be registered
 * when register_sidebar() is invoked.
 *
 * @param int $post_id ID of a 'sidebar_instance' post.
 *
 * @return string Custom sidebar id.
 */
function get_sidebar_id( $post_id ) {
	return apply_filters( 'ecs_sidebar_id', "ecs-sidebar-{$post_id}", $post_id );
}

/**
 * Get Sidebar Description
 *
 * Gets the description text that will be
 * displayed in the Widgets interface.
 *
 * @param int $post_id ID of a 'sidebar_instance' post.
 */
function get_sidebar_description( $post_id ) {
	return apply_filters(
		'ecs_sidebar_description',
		get_post_meta( $post_id, 'sidebar_description', true ),
		$post_id
	);
}

/**
 * Get Sidebar Replacement ID
 *
 * Gets the id of the default registered sidebar
 * that this custom sidebar is replacing.
 *
 * @param int $post_id ID of a 'sidebar_instance' post.
 */
function get_sidebar_replacement_id( $post_id ) {
	return apply_filters(
		'ecs_sidebar_replacement_id',
		get_post_meta( $post_id, 'sidebar_replacement_id', true ),
		$post_id
	);
}

/**
 * Get Sidebar Attachments
 *
 * @param int $post_id ID of a 'sidebar_instance' post.
 */
function get_sidebar_attachments( $post_id ) {
	$attachments = get_post_meta( $post_id, 'sidebar_attachments', true );
	$attachments = empty( $attachments ) ? [] : $attachments;

	return apply_filters(
		'ecs_sidebar_attachments',
		$attachments,
		$post_id
	);
}

/**
 * Get Default Registered Sidebars
 *
 * Gets every sidebar that wasn't
 * registered by this plugin.
 *
 * @return array sidebars.
 */
function get_default_registered_sidebars() {
	global $wp_registered_sidebars;

	return array_filter(
		$wp_registered_sidebars,
		function ( $sidebar ) {
			return empty( $sidebar['ecs_custom_sidebar'] );
		}
	);
}

/**
 * Delete All Sidebars
 *
 * @return boolean true after all sidebars have been deleted.
 */
function delete_all_sidebars() {
	$all_sidebars = new \WP_Query(
		[
			'post_type'      => 'sidebar_instance',
			'posts_per_page' => -1,
		]
	);

	if ( $all_sidebars->have_posts() ) {
		while ( $all_sidebars->have_posts() ) {
			$all_sidebars->the_post();
			wp_delete_post( get_the_ID(), true );
		}
		wp_reset_postdata();
	}

	return true;
}
