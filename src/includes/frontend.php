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
 */
function maybe_swap_widgets( $sidebars_widgets ) {
	if ( ! registered_sidebars_exist() || is_customize_preview() ) {
		return $sidebars_widgets;
	}

	if ( sidebar_replacements_determined() ) {
		// Then figure out the swap.
	} else {
		// Determine sidebar replacements.
		// Store the swaps.
	}

	// $replacement_exists;

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

// @todo: Remove after testing.
add_action('wp_body_open', function() {
	$all_sidebars = new \WP_Query(
		[
			'post_type'      => 'sidebar_instance',
			'posts_per_page' => -1,
		]
	);

	while ($all_sidebars->have_posts()) {
		$all_sidebars->the_post();
		echo '<h1>' . get_the_ID() . '</h1>';
		echo '<pre>';
		print_r( Data\get_sidebar_attachments( get_the_ID() ) );
		echo '</pre>';
		echo '<pre>';
		print_r( Data\get_sidebar_attachments( get_the_ID(), true ) );
		echo '</pre>';
	}
	wp_reset_postdata();

	// Data\get_default_registered_sidebars();
	?>
	<h1>ok this is a test <?php echo wp_count_posts( 'sidebar_instance' )->publish; ?></h1>
	<?php
});

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

// function get_widget_area_replacement( $sidebar_index ) {}

// Conditions
// => Front Page.
// => Search Results.
// => Author Archive.
// => Author Archive All.
// => Date Archive.
// => Page.
// => Page Templates.
// => All Pages.
// => Post Type Single.
// => All Posts in Category.
// => Post Format.
// => All Posts in Post Type.
// => Taxonomy Term.
// => All Taxonomy Terms in Taxonomy.
// => Post Type Archive.

// Need to add:
// WooCommerce Integration.
