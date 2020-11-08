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
  return state.sidebarAttachments[id] || [];
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

export const getTaxonomyTerms = (state, { slug, rest_base, page }) => {
  return state.metaboxes.taxonomies[slug] || {};
};

export const getUsers = (state, { page }) => {
  return state.metaboxes.users || {};
};

export const getTemplates = state => {
  return state.metaboxes.templates || {};
};
