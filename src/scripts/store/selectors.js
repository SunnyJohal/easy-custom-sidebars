// the selector returns a value from the state using the arguments provided.

/**
 * Sidebar Selectors
 * @param {*} name
 */

export const getSidebars = state => {
  return state.sidebars || {};
};

export const getSidebar = (state, id) => {
  return state.sidebars[id] || {};
};

/**
 * Sidebar Attachment Selectors
 * @param {*} name
 */

export const getAttachmentsForSidebar = (state, id) => {
  return state.attachments[id] || [];
};

/**
 * Default Sidebar Selectors
 * @param {*} name
 */

export const getDefaultSidebars = state => {
  return state.defaultSidebars || {};
};

/**
 * Metabox Selectors
 */
export const getPostTypes = state => {
  return state.posttypes || {};
};

export const getTaxonomies = state => {
  return state.taxonomies || {};
};

export const getPostTypePosts = (state, { slug, rest_base, page }) => {
  return state.metaboxes.posttypes[slug] || {};
};

export const getTaxonomyTerms = (state, { slug, rest_base, page }) => {};

export const getCategories = (state, page) => {};

export const getUsers = (state, page) => {};

export const getTemplates = state => {};
