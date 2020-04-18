<?php
/**
 * API
 *
 * Registers any functionality to use/extend
 * the WordPress REST API.
 *
 * @package Easy_Custom_Sidebars
 * @author  Sunny Johal - Titanium Themes <support@titaniumthemes.com>
 */

namespace ECS\Api;

add_action(
	'rest_api_init',
	function() {
		// TODO: Expand the attachment data as normalised json.
		register_rest_field(
			'sidebar_instance',
			'ecs_attachment_details',
			[
				'get_callback' => function( $post ) {
					// TODO: Call a function that will return an
					// array of attachments with consistent props.
					return $post->id;
				},
			]
		);
	}
);
