/**
 * Sidebar Actions
 * @param {*} name
 */
export const createSidebar = name => {
  return {
    type: 'ecs/CREATE_SIDEBAR',
    payload: name
  };
};

export const updateSidebar = (id, name, attachments, settings) => {
  return {
    type: 'ecs/UPDATE_SIDEBAR',
    payload: {
      id,
      name,
      attachments,
      settings
    }
  };
};

export const deleteSidebar = id => {
  return {
    type: 'ecs/DELETE_SIDEBAR',
    payload: { id }
  };
};

export const addToSidebar = (id, attachment) => {
  return {
    type: 'ecs/ADD_TO_SIDEBAR',
    payload: {
      id,
      attachment
    }
  };
};

/**
 * Metabox Actions
 * @param {*} name
 */

// GET Posttypes Metabox items.
// GET Taxonomies Metabox items.

// Metabox Events:
// Show/Hide Metabox. (This needs to be persistent).
// Paginate items in metabox.
// Search items in metabox (inc pagination on results).
//
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

export default {
  deleteSidebar
};
