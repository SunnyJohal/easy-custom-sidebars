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
			'public'                => true,
			'hierarchical'          => false,
			'rewrite'               => false,
			'delete_with_user'      => false,
			'query_var'             => false,
			'show_in_rest'          => true,
			'rest_base'             => 'easy_custom_sidebars',
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
		'sidebar_attachments',
		[
			'type'         => 'string',
			'single'       => true,
			'show_in_rest' => [
				'schema' => [
					'items' => [
						'type'       => 'object',
						'properties' => [
							'menu-item-db-id'  => [ 'type' => 'string' ],
							'menu-item-object' => [ 'type' => 'string' ],
							'menu-item-type'   => [ 'type' => 'string' ],
						],
					],
				],
			],
		]
	);
}
add_action( 'init', __NAMESPACE__ . '\\register_metadata_for_sidebars' );
