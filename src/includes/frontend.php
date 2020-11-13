<?php
/**
 * Frontend Functionality
 *
 * Contains the logic to swap the widgets on
 * the frontend.
 *
 * @package Easy_Custom_Sidebars
 * @author  Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 */

namespace ECS\Frontend;

use ECS\Data;

/**
 * Private
 *
 * Boolean flag to check if replacements
 * have been identified for each sidebar.
 *
 * @global $_ecs_replacements_determined
 * @var boolean
 */
$_ecs_replacements_determined = false;

/**
 * Private
 *
 * Stores the replacement sidebars, since it
 * is possible to replace more than one on
 * the same page.
 *
 * @global $_ecs_all_replacements
 * @var array
 */
$_ecs_all_replacements = [];

/**
 * Maybe Swap Widgets
 *
 * @todo Only run the query to swap once.
 * @todo Come up with an efficent way to query relevant replacements.
 * @todo Move to a filter based system to determine query/sidebar hierarchy.
 *
 * @param array $sidebars_widgets Assoc arr of widget areas and their widgets.
 */
function maybe_swap_widgets( $sidebars_widgets ) {
	if (
		! registered_sidebars_exist() ||
		! did_action( 'wp_head' ) ||
		is_customize_preview()
	) {
		return $sidebars_widgets;
	}

	$default_widget_area_ids = wp_list_pluck( Data\get_default_registered_sidebars(), 'id' );

	if ( ! sidebar_replacements_determined() ) {
		determine_sidebar_replacements( $default_widget_area_ids );
	}

	// Swap widgets.
	$all_replacements = get_all_sidebar_replacements();

	foreach ( $default_widget_area_ids as $default_widget_area_id ) {
		if ( array_key_exists( $default_widget_area_id, $all_replacements ) ) {
			$sidebar_replacement_id = $all_replacements[ $default_widget_area_id ];

			// Detect replacement with no widget.
			if ( ! isset( $sidebars_widgets[ $sidebar_replacement_id ] ) ) {
				$sidebars_widgets[ $sidebar_replacement_id ] = [];
			}

			// Swap widget.
			$sidebars_widgets[ $default_widget_area_id ] = $sidebars_widgets[ $sidebar_replacement_id ];
		}
	}

	return $sidebars_widgets;
}
add_filter( 'sidebars_widgets', __NAMESPACE__ . '\\maybe_swap_widgets' );

/**
 * Registered Sidebars Exist
 *
 * Checks if WordPress has registered
 * any sidebars.
 *
 * @global $wp_registered_sidebars
 *
 * @return boolean true|false If sidebars have/haven't been registered.
 */
function registered_sidebars_exist() {
	global $wp_registered_sidebars;
	return ! empty( $wp_registered_sidebars );
}

/**
 * Sidebar Replacements Determined
 *
 * Checks if the replacement sidebars have
 * already been identified and processed.
 *
 * @return boolean true|false If replacements have\haven't been identified.
 */
function sidebar_replacements_determined() {
	global $_ecs_replacements_determined;
	return rest_sanitize_boolean( $_ecs_replacements_determined );
}

/**
 * Determine Sidebar Replacements
 *
 * @param array $default_widget_area_ids Arr of widget area ids.
 */
function determine_sidebar_replacements( $default_widget_area_ids ) {
	global $_ecs_all_replacements;

	$current_context = get_current_frontend_context();

	$_ecs_all_replacements = array_reduce(
		$default_widget_area_ids,
		function( $all_replacements, $widget_area_id ) use ( &$current_context ) {
			$replacement_id = get_widget_area_replacement_id( $widget_area_id, $current_context );

			if ( $replacement_id ) {
				$all_replacements[ $widget_area_id ] = $replacement_id;
			}

			return $all_replacements;
		},
		[]
	);

	set_replacements_determined( true );
}

/**
 * Get Widget Area Replacment.
 *
 * @param string $widget_area_id The unique identifier for the sidebar.
 * @param string $context The current frontend context for the user.
 */
function get_widget_area_replacement_id( $widget_area_id, $context ) {
	$replacement = [
		'id'    => false,
		'score' => 0,
	];

	$custom_sidebars = new \WP_Query(
		[
			'post_type'      => 'sidebar_instance',
			'meta_key'       => 'sidebar_replacement_id', // @codingStandardsIgnoreLine
			'meta_value'     => $widget_area_id, // @codingStandardsIgnoreLine
			'orderby'        => 'title',
			'order'          => 'ASC',
			'posts_per_page' => -1,
			'fields'         => 'ids',
		]
	);

	foreach ( $custom_sidebars->posts as $possible_replacement_id ) {
		$replacement = apply_filters(
			'ecs_widget_area_replacement_id',
			$replacement,
			$possible_replacement_id,
			$context,
			Data\get_sidebar_attachments( $possible_replacement_id ),
			$widget_area_id
		);
	}

	return $replacement['id'];
}

/**
 * Get Current Frontend Context
 *
 * Determines the current frontend context
 * upfront for efficent querying.
 */
function get_current_frontend_context() {
	$context = false;

	// Template hierarchy.
	if ( is_404() ) {
		$context = 'is_404';
	}

	if ( is_search() ) {
		$context = 'is_search';
	}

	if ( is_home() ) {
		$context = 'is_home';
	}

	if ( is_author() ) {
		$context = 'is_author';
	}

	if ( is_date() ) {
		$context = 'is_date';
	}

	if ( ! is_home() && is_page() ) {
		$context = 'is_page';
	}

	if ( is_single() ) {
		$context = 'is_single';
	}

	if ( is_tax() || is_category() || is_tag() ) {
		$context = 'is_taxonomy';
	}

	if ( is_archive() && ! is_category() && ! is_tax() && ! is_tag() ) {
		$context = 'is_post_type_archive';
	}

	return apply_filters( 'ecs_current_frontend_context', $context );
}

/**
 * Set Sidebar Replacements Determined
 *
 * Updates the global to flag if the
 * replacements have been identified.
 *
 * @param boolean $is_determined true/false to flag if checks are complete.
 */
function set_replacements_determined( $is_determined ) {
	global $_ecs_replacements_determined;
	$_ecs_replacements_determined = $is_determined;
}

/**
 * Get All Sidebar Replacements
 *
 * @return mixed $_ecs_all_replacements (Array|Boolean).
 */
function get_all_sidebar_replacements() {
	global $_ecs_all_replacements;
	return $_ecs_all_replacements;
}

/**
 * Detect Template Hierarchy Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_404_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	$template_attachments = wp_list_filter( $attachments, [ 'attachment_type' => 'template_hierarchy' ] );
	$better_match_found   = $replacement['score'] > 10;

	if ( $better_match_found || empty( $template_attachments ) || ! 'is_404' === $context ) {
		return $replacement;
	}

	$new_replacement = [
		'id'    => $possible_replacement_id,
		'score' => 10,
	];

	if (
		'is_404' === $context &&
		! empty( wp_list_filter( $template_attachments, [ 'data_type' => '404' ] ) )
	) {
		return $new_replacement;
	}

	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_404_replacements',
	10,
	5
);
