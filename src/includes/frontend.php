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

// Data structure for item_ids[] array stored as meta key: 'sidebar_attachments'
// type [menu-item-type]
// id   [menu-item-db-id]
// data

// 'menu-item-db-id'  => [ 'type' => 'string' ],
// 'menu-item-object' => [ 'type' => 'string' ],
// 'menu-item-type'   => [ 'type' => 'string' ],

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

// TODO: Remove after testing.
add_action('wp_body_open', function() {
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
