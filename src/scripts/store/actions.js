/**
 * WordPress dependencies.
 */
import { apiFetch } from '@wordpress/data-controls';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../store';

/**
 * Sidebar Actions
 * @param {*} name
 */
// Hydrate.
export const hydrateSidebars = sidebars => {
  return {
    type: 'HYDRATE_SIDEBARS',
    payload: { sidebars }
  };
};

/**
 * Create Sidebar
 * @param {string} name Name of sidebar.
 */
export function* createSidebar({ name, attachments, settings }) {
  const path = '/wp/v2/easy-custom-sidebars';
  const sidebar = yield apiFetch({ path, method: 'POST', data: { title: name, status: 'publish' } });

  return {
    type: 'CREATE_SIDEBAR',
    payload: {
      id: sidebar.id,
      sidebar
    }
  };
}

/**
 * Update Sidebar
 * @param {object} sidebar Sidebar properties and attachments.
 */
export const updateSidebar = ({ id, name, attachments, settings }) => {
  return {
    type: 'UPDATE_SIDEBAR',
    payload: {
      id,
      name,
      attachments,
      settings
    }
  };
};

/**
 * Update Sidebar Replacement
 * @param {*} id
 */
export function* updateSidebarReplacement({ id, replacementId }) {
  const path = `/wp/v2/easy-custom-sidebars/${id}`;
  const sidebar = yield apiFetch({
    path,
    method: 'POST',
    data: {
      meta: {}
    }
  });

  return {
    type: 'UPDATE_SIDEBAR_REPLACEMENT',
    payload: {
      id
    }
  };
}

/**
 * Delete Sidebar
 * @param {int} id Post ID of sidebar to delete.
 */
export function* deleteSidebar(id) {
  // Delete on server.
  const path = `/wp/v2/easy-custom-sidebars/${id}`;
  const deletedSidebar = yield apiFetch({ path, method: 'DELETE' });

  // Delete in state.
  return {
    type: 'DELETE_SIDEBAR',
    payload: { id, deletedSidebar }
  };
}

/**
 * Add Attachment to Sidebar
 * @param {int} id Post ID of sidebar.
 * @param {array} attachment Attachment details.
 */
export const addSidebarAttachment = (id, attachment) => {
  return {
    type: 'ADD_SIDEBAR_ATTACHMENT',
    payload: {
      id,
      attachment
    }
  };
};

export const deleteSidebarAttachment = (id, attachment) => {
  return {
    type: 'DELETE_SIDEBAR_ATTACHMENT',
    payload: {
      id,
      attachment
    }
  };
};

/**
 * Default Sidebar Actions
 * @param {*} name
 */
export const hydrateDefaultSidebars = defaultSidebars => {
  return {
    type: 'HYDRATE_DEFAULT_SIDEBARS',
    payload: { defaultSidebars }
  };
};

/**
 * Metabox Actions
 * @param {*} name
 */

// Metabox Events:
// GET Posttypes Metabox items.
// GET Taxonomies Metabox items.
// Show/Hide Metabox. (This needs to be persistent).
// Paginate items in metabox.
// Search items in metabox (inc pagination on results).

// $this->setup_post_type_meta_boxes();
// $this->setup_category_posts_boxes();
// $this->setup_taxonomy_meta_boxes();
// $this->setup_author_meta_box();
// $this->setup_template_meta_box();

// Attachment Events:
// Reorder attachment.
// Add attachment to sidebar.
// Prevent navigation when state changes for a sidebar.
// Remove attachment from sidebar.
