/**
 * WordPress dependencies.
 */
import { apiFetch } from '@wordpress/data-controls';
import { addQueryArgs } from '@wordpress/url';

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
export function* createSidebar({ name, attachments, description, replacementId }) {
  const sidebarAttachments = attachments.map(attachment => ({
    id: attachment.id,
    data_type: attachment.data_type,
    attachment_type: attachment.attachment_type
  }));

  const path = '/wp/v2/easy-custom-sidebars';
  const sidebar = yield apiFetch({
    path,
    method: 'POST',
    data: {
      title: name,
      status: 'publish',
      meta: {
        sidebar_replacement_id: replacementId,
        sidebar_description: description,
        sidebar_attachments: sidebarAttachments
      }
    }
  });

  return {
    type: 'CREATE_SIDEBAR',
    payload: {
      id: sidebar.id,
      sidebar,
      attachments
    }
  };
}

/**
 * Update Sidebar
 * @param {object} sidebar Sidebar properties and attachments.
 */
export function* updateSidebar({ id, name, attachments, replacementId }) {
  const sidebarAttachments = attachments.map(attachment => ({
    id: attachment.id,
    data_type: attachment.data_type,
    attachment_type: attachment.attachment_type
  }));

  const path = `/wp/v2/easy-custom-sidebars/${id}`;
  const sidebar = yield apiFetch({
    path,
    method: 'POST',
    data: {
      title: name,
      meta: {
        sidebar_replacement_id: replacementId,
        sidebar_description: description,
        sidebar_attachments: sidebarAttachments
      }
    }
  });

  return {
    type: 'UPDATE_SIDEBAR',
    payload: {
      id: sidebar.id,
      sidebar,
      attachments
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
 * Sidebar Attachments Actions
 * @param {int} id Post ID of sidebar.
 */
export const hydrateSidebarAttachments = (id, attachments) => {
  return {
    type: 'HYDRATE_SIDEBAR_ATTACHMENTS',
    payload: { id, attachments }
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

export const hydratePostTypePosts = ({ slug, page, posts, totalItems, totalPages }) => {
  return {
    type: 'HYDRATE_POSTTYPE_POSTS',
    payload: {
      slug,
      page,
      posts,
      totalItems,
      totalPages
    }
  };
};

export const hydrateTaxonomyTerms = ({ slug, page, terms, totalItems, totalPages }) => {
  return {
    type: 'HYDRATE_TAXONOMY_TERMS',
    payload: {
      slug,
      page,
      terms,
      totalItems,
      totalPages
    }
  };
};

export function* getCategories({ page = 1 }) {
  const path = addQueryArgs(`/wp/v2/categories`, { page, _envelope: 1 });
  const categories = yield apiFetch({ path, method: 'GET' });

  return {
    type: 'CATEGORIES_REQUEST',
    payload: {
      page,
      categories: categories.body,
      totalCategories: categories.headers['X-WP-Total'],
      totalPages: categories.headers['X-WP-TotalPages']
    }
  };
}

export function* getPostCategories({ page = 1 }) {
  const path = addQueryArgs(`/wp/v2/categories`, { page, _envelope: 1 });
  const categories = yield apiFetch({ path, method: 'GET' });

  return {
    type: 'POSTS_CATEGORIES_REQUEST',
    payload: {
      page,
      categories: categories.body,
      totalCategories: categories.headers['X-WP-Total'],
      totalPages: categories.headers['X-WP-TotalPages']
    }
  };
}

export function* getUsers({ page = 1 }) {
  const path = addQueryArgs(`/wp/v2/users`, { page, _envelope: 1 });
  const users = yield apiFetch({ path, method: 'GET' });

  return {
    type: 'USERS_REQUEST',
    payload: {
      page,
      users: users.body,
      totalUsers: users.headers['X-WP-Total'],
      totalPages: users.headers['X-WP-TotalPages']
    }
  };
}

// @todo: Use body wherevever we have requested the full page.
export function* getTemplates() {
  // @todo: create custom endpoint.
  const path = `/easy-custom-sidebars/v1/page-templates`;
  const templates = yield apiFetch({ path, method: 'GET' });
  return {
    type: 'TEMPLATES_REQUEST',
    payload: {
      templates
    }
  };
}

// Fields to note:
// Total pages.
// Current page.
// Per Page?
// Items.
// Total items.

// X-WP-Total: 50
// X-WP-TotalPages: 5

// SEARCH EXAMPLE:
// wp.apiFetch({
//   path: '/wp/v2/product?_envelope=1&search=shirt',
//   method: 'GET'
// }).then((response) => console.log(response));

// A MORE EFFICENT QUERY.
// wp.apiFetch({
//   path: '/wp/v2/posts?page=2&_envelope=1&_fields=title,date,id,link',
//   method: 'GET'
// }).then((response) => console.log(response));

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
