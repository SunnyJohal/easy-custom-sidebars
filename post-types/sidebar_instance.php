<?php

/**
 * Registers the `sidebar_instance` post type.
 */
function sidebar_instance_init() {
	register_post_type(
		'sidebar_instance',
		array(
			'labels'                => array(
				'name'                  => __( 'Sidebar instances', 'easy-custom-sidebars' ),
				'singular_name'         => __( 'Sidebar instance', 'easy-custom-sidebars' ),
				'all_items'             => __( 'All Sidebar instances', 'easy-custom-sidebars' ),
				'archives'              => __( 'Sidebar instance Archives', 'easy-custom-sidebars' ),
				'attributes'            => __( 'Sidebar instance Attributes', 'easy-custom-sidebars' ),
				'insert_into_item'      => __( 'Insert into sidebar instance', 'easy-custom-sidebars' ),
				'uploaded_to_this_item' => __( 'Uploaded to this sidebar instance', 'easy-custom-sidebars' ),
				'featured_image'        => _x( 'Featured Image', 'sidebar_instance', 'easy-custom-sidebars' ),
				'set_featured_image'    => _x( 'Set featured image', 'sidebar_instance', 'easy-custom-sidebars' ),
				'remove_featured_image' => _x( 'Remove featured image', 'sidebar_instance', 'easy-custom-sidebars' ),
				'use_featured_image'    => _x( 'Use as featured image', 'sidebar_instance', 'easy-custom-sidebars' ),
				'filter_items_list'     => __( 'Filter sidebar instances list', 'easy-custom-sidebars' ),
				'items_list_navigation' => __( 'Sidebar instances list navigation', 'easy-custom-sidebars' ),
				'items_list'            => __( 'Sidebar instances list', 'easy-custom-sidebars' ),
				'new_item'              => __( 'New Sidebar instance', 'easy-custom-sidebars' ),
				'add_new'               => __( 'Add New', 'easy-custom-sidebars' ),
				'add_new_item'          => __( 'Add New Sidebar instance', 'easy-custom-sidebars' ),
				'edit_item'             => __( 'Edit Sidebar instance', 'easy-custom-sidebars' ),
				'view_item'             => __( 'View Sidebar instance', 'easy-custom-sidebars' ),
				'view_items'            => __( 'View Sidebar instances', 'easy-custom-sidebars' ),
				'search_items'          => __( 'Search sidebar instances', 'easy-custom-sidebars' ),
				'not_found'             => __( 'No sidebar instances found', 'easy-custom-sidebars' ),
				'not_found_in_trash'    => __( 'No sidebar instances found in trash', 'easy-custom-sidebars' ),
				'parent_item_colon'     => __( 'Parent Sidebar instance:', 'easy-custom-sidebars' ),
				'menu_name'             => __( 'Sidebar instances', 'easy-custom-sidebars' ),
			),
			'public'                => true,
			'hierarchical'          => false,
			'show_ui'               => true,
			'show_in_nav_menus'     => true,
			'supports'              => array( 'title', 'editor' ),
			'has_archive'           => true,
			'rewrite'               => true,
			'query_var'             => true,
			'menu_position'         => null,
			'menu_icon'             => 'dashicons-admin-post',
			'show_in_rest'          => true,
			'rest_base'             => 'sidebar_instance',
			'rest_controller_class' => 'WP_REST_Posts_Controller',
		)
	);
}
add_action( 'init', 'sidebar_instance_init' );

/**
 * Sets the post updated messages for the `sidebar_instance` post type.
 *
 * @param  array $messages Post updated messages.
 * @return array Messages for the `sidebar_instance` post type.
 */
function sidebar_instance_updated_messages( $messages ) {
	global $post;

	$permalink = get_permalink( $post );

	$messages['sidebar_instance'] = array(
		0  => '', // Unused. Messages start at index 1.
		/* translators: %s: post permalink */
		1  => sprintf( __( 'Sidebar instance updated. <a target="_blank" href="%s">View sidebar instance</a>', 'easy-custom-sidebars' ), esc_url( $permalink ) ),
		2  => __( 'Custom field updated.', 'easy-custom-sidebars' ),
		3  => __( 'Custom field deleted.', 'easy-custom-sidebars' ),
		4  => __( 'Sidebar instance updated.', 'easy-custom-sidebars' ),
		/* translators: %s: date and time of the revision */
		5  => isset( $_GET['revision'] ) ? sprintf( __( 'Sidebar instance restored to revision from %s', 'easy-custom-sidebars' ), wp_post_revision_title( (int) $_GET['revision'], false ) ) : false,
		/* translators: %s: post permalink */
		6  => sprintf( __( 'Sidebar instance published. <a href="%s">View sidebar instance</a>', 'easy-custom-sidebars' ), esc_url( $permalink ) ),
		7  => __( 'Sidebar instance saved.', 'easy-custom-sidebars' ),
		/* translators: %s: post permalink */
		8  => sprintf( __( 'Sidebar instance submitted. <a target="_blank" href="%s">Preview sidebar instance</a>', 'easy-custom-sidebars' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
		/* translators: 1: Publish box date format, see https://secure.php.net/date 2: Post permalink */
		9  => sprintf( __( 'Sidebar instance scheduled for: <strong>%1$s</strong>. <a target="_blank" href="%2$s">Preview sidebar instance</a>', 'easy-custom-sidebars' ),
		date_i18n( __( 'M j, Y @ G:i', 'easy-custom-sidebars' ), strtotime( $post->post_date ) ), esc_url( $permalink ) ),
		/* translators: %s: post permalink */
		10 => sprintf( __( 'Sidebar instance draft updated. <a target="_blank" href="%s">Preview sidebar instance</a>', 'easy-custom-sidebars' ), esc_url( add_query_arg( 'preview', 'true', $permalink ) ) ),
	);

	return $messages;
}
add_filter( 'post_updated_messages', 'sidebar_instance_updated_messages' );
