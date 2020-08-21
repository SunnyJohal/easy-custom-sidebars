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

use ECS\Data;

/**
 * Add Metabox Batch Endpoint
 *
 * @todo implement method.
 */
add_action(
	'rest_api_init',
	function() {
	}
);

/**
 * Add Bulk Delete Endpoint
 *
 * @todo implement method
 */
add_action(
	'rest_api_init',
	function() {
	}
);

/**
 * Add Attachment Details
 */
add_action(
	'rest_api_init',
	function() {
		register_rest_field(
			'sidebar_instance',
			'ecs_attachments',
			[
				'get_callback' => function( $post ) {
					return Data\get_sidebar_attachments( $post['id'] );
				},
			]
		);
	}
);
