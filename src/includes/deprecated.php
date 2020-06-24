<?php
/**
 * Backward Compatibility
 *
 * Preserves data for sidebars created in versions
 * of easy custom sidebars prior to v2.0.0.
 *
 * @package Easy_Custom_Sidebars
 * @author  Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 */

namespace ECS\Deprecated;

add_filter(
	'get_post_metadata',
	function ( $value, $post_id, $meta_key, $single ) {
		if ( 'sidebar_attachments' !== $meta_key ) {
			return $value;
		}

		// TODO: Shape data from old saved data to the new form.
		return $value;
	},
	10,
	4
);

/**
 * Preserve Legacy Sidebar IDs
 *
 * Handle legacy sidebar ids, new ids will be
 * generated dynamically from the post id.
 *
 * @param string $sidebar_id Generated sidebar_id slug used in register_sidebar().
 * @param int    $post_id ID of a 'sidebar_instance' post.
 */
function preserve_legacy_sidebar_id( $sidebar_id, $post_id ) {
	$old_sidebar_id = get_post_meta( $post_id, 'sidebar_id', true );

	if ( ! empty( $old_sidebar_id ) ) {
		return $old_sidebar_id;
	}

	return $sidebar_id;
}
add_filter( 'ecs_sidebar_id', __NAMESPACE__ . '\\preserve_legacy_sidebar_id', 10, 2 );
