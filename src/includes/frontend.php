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

	$current_context = apply_filters( 'ecs_current_frontend_context', get_current_frontend_context() );

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
 * Get Widget Area Replacement.
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

	return empty( $replacement['id'] ) ? false : Data\get_sidebar_id( $replacement['id'] );
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
		return 'is_404';
	}

	if ( is_search() ) {
		return 'is_search';
	}

	if ( is_home() ) {
		return 'is_home';
	}

	if ( is_author() ) {
		return 'is_author';
	}

	if ( is_date() ) {
		return 'is_date';
	}

	if ( ! is_home() && is_page() ) {
		return 'is_page';
	}

	if ( is_single() ) {
		return 'is_single';
	}

	if ( is_tax() || is_category() || is_tag() ) {
		return 'is_taxonomy';
	}

	if ( is_archive() && ! is_category() && ! is_tax() && ! is_tag() ) {
		return 'is_post_type_archive';
	}

	return $context;
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
 * Detect 404 Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_404_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	$template_attachments = wp_list_filter( $attachments, [ 'attachment_type' => 'template_hierarchy' ] );
	$replacement_score    = 10;
	$better_match_found   = $replacement['score'] > $replacement_score;

	if ( $better_match_found || empty( $template_attachments ) || 'is_404' !== $context ) {
		return $replacement;
	}

	$new_replacement = [
		'id'    => $possible_replacement_id,
		'score' => $replacement_score,
	];

	if ( ! empty( wp_list_filter( $template_attachments, [ 'data_type' => '404' ] ) ) ) {
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

/**
 * Detect Search Result Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_search_result_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	$template_attachments = wp_list_filter( $attachments, [ 'attachment_type' => 'template_hierarchy' ] );
	$replacement_score    = 10;
	$better_match_found   = $replacement['score'] > $replacement_score;

	if ( $better_match_found || empty( $template_attachments ) || 'is_search' !== $context ) {
		return $replacement;
	}

	$new_replacement = [
		'id'    => $possible_replacement_id,
		'score' => $replacement_score,
	];

	if ( ! empty( wp_list_filter( $template_attachments, [ 'data_type' => 'search_results' ] ) ) ) {
		return $new_replacement;
	}

	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_search_result_replacements',
	10,
	5
);

/**
 * Detect Search Result Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_date_archive_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	$template_attachments = wp_list_filter( $attachments, [ 'attachment_type' => 'template_hierarchy' ] );
	$replacement_score    = 10;
	$better_match_found   = $replacement['score'] > $replacement_score;

	if ( $better_match_found || empty( $template_attachments ) || 'is_date' !== $context ) {
		return $replacement;
	}

	$new_replacement = [
		'id'    => $possible_replacement_id,
		'score' => $replacement_score,
	];

	if ( ! empty( wp_list_filter( $template_attachments, [ 'data_type' => 'date_archive' ] ) ) ) {
		return $new_replacement;
	}

	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_date_archive_replacements',
	10,
	5
);

/**
 * Detect Author Archive All Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_author_archive_all_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	$template_attachments = wp_list_filter( $attachments, [ 'attachment_type' => 'template_hierarchy' ] );
	$replacement_score    = 10;
	$better_match_found   = $replacement['score'] > $replacement_score;

	if ( $better_match_found || empty( $template_attachments ) || 'is_author' !== $context ) {
		return $replacement;
	}

	$new_replacement = [
		'id'    => $possible_replacement_id,
		'score' => $replacement_score,
	];

	if ( ! empty( wp_list_filter( $template_attachments, [ 'data_type' => 'author_archive_all' ] ) ) ) {
		return $new_replacement;
	}

	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_author_archive_all_replacements',
	10,
	5
);

/**
 * Detect Author Archive Single Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_author_archive_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	$archive_attachments = wp_list_filter( $attachments, [ 'attachment_type' => 'author_archive' ] );
	$replacement_score   = 20;
	$better_match_found  = $replacement['score'] > $replacement_score;

	if ( $better_match_found || empty( $archive_attachments ) || 'is_author' !== $context ) {
		return $replacement;
	}

	$new_replacement = [
		'id'    => $possible_replacement_id,
		'score' => $replacement_score,
	];

	$author_archive_attachments = wp_list_filter(
		$archive_attachments,
		[
			'id'        => get_queried_object_id(),
			'data_type' => 'user',
		]
	);

	if ( ! empty( $author_archive_attachments ) ) {
		return $new_replacement;
	}

	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_author_archive_replacements',
	20,
	5
);


/**
 * Detect Taxonomy All Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_taxonomy_all_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	$taxonomy_attachments = wp_list_filter( $attachments, [ 'attachment_type' => 'taxonomy_all' ] );
	$replacement_score    = 10;
	$better_match_found   = $replacement['score'] > $replacement_score;

	if ( $better_match_found || empty( $taxonomy_attachments ) || 'is_taxonomy' !== $context ) {
		return $replacement;
	}

	$new_replacement = [
		'id'    => $possible_replacement_id,
		'score' => $replacement_score,
	];

	$taxonomy_term_all_attachments = wp_list_filter(
		$taxonomy_attachments,
		[
			'data_type' => get_queried_object()->taxonomy,
		]
	);

	if ( ! empty( $taxonomy_term_all_attachments ) ) {
		return $new_replacement;
	}

	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_taxonomy_all_replacements',
	10,
	5
);

/**
 * Detect Taxonomy Term Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_taxonomy_term_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_taxonomy_term_replacements',
	20,
	5
);

/**
 * Detect All Page Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_page_all_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_page_all_replacements',
	10,
	5
);

/**
 * Detect Page Template Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_page_template_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_page_template_replacements',
	20,
	5
);

/**
 * Detect Single Page Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_single_page_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_single_page_replacements',
	30,
	5
);

/**
 * Detect Index Page Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_index_page_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_index_page_replacements',
	40,
	5
);

/**
 * Detect Posttype Archive Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_post_archive_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_post_archive_replacements',
	10,
	5
);

/**
 * Detect All Posttype Posts Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_all_posttype_post_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_all_posttype_post_replacements',
	20,
	5
);

/**
 * Detect Post Format Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_post_format_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_post_format_replacements',
	30,
	5
);

/**
 * Detect All Posts in Category Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_all_posts_in_category_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_all_posts_in_category_replacements',
	40,
	5
);

/**
 * Detect Single/Singular Replacements
 *
 * @param array  $replacement Current selected replacement metadata (if applicable).
 * @param string $possible_replacement_id ID of possible sidebar replacement.
 * @param string $context Current frontend context.
 * @param array  $attachments Arr of custom sidebar replacement attachments.
 * @param string $widget_area_id Original sidebar id.
 */
function detect_single_post_replacements( $replacement, $possible_replacement_id, $context, $attachments, $widget_area_id ) {
	return $replacement;
}
add_filter(
	'ecs_widget_area_replacement_id',
	__NAMESPACE__ . '\\detect_single_post_replacements',
	50,
	5
);


