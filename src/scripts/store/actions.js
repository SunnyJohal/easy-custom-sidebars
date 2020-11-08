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

export const hydrateUsers = ({ page, users, totalItems, totalPages }) => {
  return {
    type: 'HYDRATE_USERS',
    payload: {
      page,
      users,
      totalItems,
      totalPages
    }
  };
};

export const hydrateTemplates = ({ templates }) => {
  return {
    type: 'HYDRATE_TEMPLATES',
    payload: { templates }
  };
};
