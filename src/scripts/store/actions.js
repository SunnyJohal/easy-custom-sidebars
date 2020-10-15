/**
 * WordPress dependencies.
 */
import { apiFetch } from '@wordpress/data-controls';
import { addQueryArgs } from '@wordpress/url';

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
export function* updateSidebar({ id, name, attachments, replacementId }) {
  const path = `/wp/v2/easy-custom-sidebars/${id}`;

  const sidebar = yield apiFetch({
    path,
    method: 'POST',
    data: {
      title: name,
      meta: {
        sidebar_replacement_id: replacementId
      }
    }
  });

  return {
    type: 'UPDATE_SIDEBAR',
    payload: {
      id: sidebar.id,
      sidebar
    }
  };
}

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
      meta: {
        sidebar_replacement_id: replacementId
      }
    }
  });

  return {
    type: 'UPDATE_SIDEBAR_REPLACEMENT',
    payload: {
      id,
      sidebar
    }
  };
}

/**
 * Delete Sidebar
 * @param {int} id Post ID of sidebar to delete.
 */
export function* deleteSidebar(id) {
  const path = `/wp/v2/easy-custom-sidebars/${id}`;
  const deletedSidebar = yield apiFetch({ path, method: 'DELETE' });

  return {
    type: 'DELETE_SIDEBAR',
    payload: { id, deletedSidebar }
  };
}

/**
 * Delete All Sidebars
 * @param {int} id Post ID of sidebar to delete.
 */
export function* deleteAllSidebars() {
  const path = '/easy-custom-sidebars/v1/sidebar_instances';
  const completed = yield apiFetch({ path, method: 'DELETE' });

  return {
    type: 'DELETE_ALL_SIDEBARS',
    payload: { completed }
  };
}

/**
 * Get Sidebar Attachments
 * @param {int} id Post ID of sidebar.
 */
export function* getSidebarAttachments(id) {
  const path = `/easy-custom-sidebars/v1/attachments/${id}`;
  const attachments = yield apiFetch({ path });

  return {
    type: 'FETCH_SIDEBAR_ATTACHMENTS',
    payload: { id, attachments }
  };
}

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
export const hydratePostTypes = posttypes => {
  return {
    type: 'HYDRATE_POSTTYPES',
    payload: { posttypes }
  };
};

export const hydrateTaxonomies = taxonomies => {
  return {
    type: 'HYDRATE_TAXONOMIES',
    payload: { taxonomies }
  };
};

// @todo: Use body wherevever we have requested the full page.
export function* getPostTypePosts({ slug, page = 1 }) {
  const path = addQueryArgs(`/wp/v2/${slug}`, { page, _envelope: 1 });

  const posts = yield apiFetch({ path, method: 'GET' });

  return {
    type: 'FETCH_POSTS',
    payload: { slug, page, posts }
  };
}

// @todo: Use body wherevever we have requested the full page.
export function* getTaxonomyTerms({ taxonomy, page = 1 }) {
  const path = addQueryArgs(`/wp/v2/${slug}`, { page, _envelope: 1 });
}

// @todo: Use body wherevever we have requested the full page.
export function* getCategories({ page = 1 }) {
  const path = addQueryArgs(`/wp/v2/categories`, { page, _envelope: 1 });
}

// @todo: Use body wherevever we have requested the full page.
export function* getUsers({ page = 1 }) {
  const path = addQueryArgs(`/wp/v2/users`, { page, _envelope: 1 });
}

export function* getTemplates() {
  // @todo: create custom endpoint.
  const path = `/wp/v2/easy-custom-sidebars/${id}`;
}

// Fields to note:
// Total pages.
// Current page.
// Per Page?
// Items.
// Total items.

// X-WP-Total: 50
// X-WP-TotalPages: 5

// Edge cases.
// Deleted items.

// Metabox Events:
// GET Posttypes Metabox items.
// GET Taxonomies Metabox items.
// GET AllPostsInCategory Metabox Items.
// GET Author Metabox items.
// GET Template Metabox items.
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
