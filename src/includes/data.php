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
			'labels'                => get_post_type_labels(),
			'public'                => false,
			'hierarchical'          => false,
			'rewrite'               => false,
			'delete_with_user'      => false,
			'query_var'             => false,
			'show_in_rest'          => true,
			'rest_base'             => 'ecs_sidebars',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\\register_post_type_for_sidebars' );

/**
 * Get Posttype Labels
 *
 * By default, post labels are used for non-hierarchical post
 * types and page labels for hierarchical ones.
 *
 * @return array $labels Labels for this post type.
 * @since 2.0.0
 */
function get_post_type_labels() {
	return [
		'name'                  => __( 'Sidebars', 'easy-custom-sidebars' ),
		'singular_name'         => __( 'Sidebar', 'easy-custom-sidebars' ),
		'all_items'             => __( 'All Sidebars', 'easy-custom-sidebars' ),
		'archives'              => __( 'Sidebar Archives', 'easy-custom-sidebars' ),
		'attributes'            => __( 'Sidebar Attributes', 'easy-custom-sidebars' ),
		'insert_into_item'      => __( 'Insert into sidebar', 'easy-custom-sidebars' ),
		'uploaded_to_this_item' => __( 'Uploaded to this sidebar', 'easy-custom-sidebars' ),
		'featured_image'        => _x( 'Featured Image', 'sidebar_instance', 'easy-custom-sidebars' ),
		'set_featured_image'    => _x( 'Set featured image', 'sidebar_instance', 'easy-custom-sidebars' ),
		'remove_featured_image' => _x( 'Remove featured image', 'sidebar_instance', 'easy-custom-sidebars' ),
		'use_featured_image'    => _x( 'Use as featured image', 'sidebar_instance', 'easy-custom-sidebars' ),
		'filter_items_list'     => __( 'Filter sidebars list', 'easy-custom-sidebars' ),
		'items_list_navigation' => __( 'Sidebar list navigation', 'easy-custom-sidebars' ),
		'items_list'            => __( 'Sidebars list', 'easy-custom-sidebars' ),
		'new_item'              => __( 'New Sidebar', 'easy-custom-sidebars' ),
		'add_new'               => __( 'Add New', 'easy-custom-sidebars' ),
		'add_new_item'          => __( 'Add New Sidebar', 'easy-custom-sidebars' ),
		'edit_item'             => __( 'Edit Sidebar', 'easy-custom-sidebars' ),
		'view_item'             => __( 'View Sidebar', 'easy-custom-sidebars' ),
		'view_items'            => __( 'View Sidebars', 'easy-custom-sidebars' ),
		'search_items'          => __( 'Search sidebars', 'easy-custom-sidebars' ),
		'not_found'             => __( 'No sidebars found', 'easy-custom-sidebars' ),
		'not_found_in_trash'    => __( 'No sidebars found in trash', 'easy-custom-sidebars' ),
		'parent_item_colon'     => __( 'Parent Sidebar:', 'easy-custom-sidebars' ),
		'menu_name'             => __( 'Sidebars', 'easy-custom-sidebars' ),
	];
}
