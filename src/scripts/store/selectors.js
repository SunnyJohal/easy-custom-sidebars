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
