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

// TODO: Handle legacy sidebar ids, new ids will be
// generated dynamically from the post id.
