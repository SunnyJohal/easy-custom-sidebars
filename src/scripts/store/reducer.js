import { combineReducers } from '@wordpress/data';

/**
 * Sidebar Reducers
 * @param {*} state
 * @param {*} action
 */
export const sidebarsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CREATE_SIDEBAR':
      return { ...state, [action.payload.id]: action.payload.sidebar };
      break;

    case 'UPDATE_SIDEBAR':
      return { ...state };
      break;

    case 'UPDATE_SIDEBAR_REPLACEMENT':
      return {
        ...state,
        [action.payload.id]: action.payload.sidebar
      };
      break;

    case 'DELETE_SIDEBAR':
      let allSidebars = { ...state };
      delete allSidebars[action.payload.id];
      return allSidebars;
      break;

    case 'DELETE_ALL_SIDEBARS':
      return {};
      break;

    case 'HYDRATE_SIDEBARS':
      return action.payload.sidebars;
      break;

    default:
      return state;
  }
};

/**
 * Sidebar Attachment Reducers
 * @param {*} state
 * @param {*} action
 */
export const sidebarAttachmentsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SIDEBAR_ATTACHMENTS_REQUEST':
      return { ...state, [action.payload.id]: action.payload.attachments };
      break;

    case 'DELETE_SIDEBAR':
      let allAttachments = { ...state };
      delete allAttachments[action.payload.id];
      return allAttachments;
      break;

    case 'DELETE_ALL_SIDEBARS':
      return {};
      break;

    default:
      return state;
  }
};

/**
 * Default Sidebar Reducers
 * @param {object} state
 * @param {object} action
 */
export const defaultSidebarsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'HYDRATE_DEFAULT_SIDEBARS':
      return action.payload.defaultSidebars;
      break;

    default:
      return state;
  }
};

export const postTypesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'HYDRATE_POSTTYPES':
      return action.payload.posttypes;
      break;

    default:
      return state;
  }
};

export const taxonomiesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'HYDRATE_TAXONOMIES':
      return action.payload.taxonomies;
      break;

    default:
      return state;
  }
};

const initialMetaboxState = {
  posttypes: {},
  taxonomies: {},
  categories: {},
  postCategories: {},
  users: {},
  templates: {}
};

export const metaboxReducer = (state = initialMetaboxState, action) => {
  switch (action.type) {
    case 'HYDRATE_POSTTYPE_POSTS':
      let existingItems = {};
      const { slug, page, posts, totalItems, totalPages } = action.payload;

      if (slug in state.posttypes && 'itemsByPage' in state.posttypes[slug]) {
        existingItems = state.posttypes[slug].itemsByPage;
      }

      let posttypeData = {
        [slug]: {
          totalItems,
          totalPages,
          itemsByPage: {
            ...existingItems,
            [page]: posts
          }
        }
      };

      return {
        ...state,
        posttypes: {
          ...state.posttypes,
          ...posttypeData
        }
      };
      break;

    case 'HYDRATE_TAXONOMY_TERMS':
      return state;
      break;

    case 'HYDRATE_CATEGORIES':
      return state;
      break;

    case 'HYDRATE_POST_CATEGORIES':
      return state;
      break;

    case 'HYDRATE_USERS':
      return state;
      break;

    case 'HYDATE_TEMPLATES':
      return state;
      break;

    default:
      return state;
  }
};

export default combineReducers({
  sidebars: sidebarsReducer,
  sidebarAttachments: sidebarAttachmentsReducer,
  defaultSidebars: defaultSidebarsReducer,
  posttypes: postTypesReducer,
  taxonomies: taxonomiesReducer,
  metaboxes: metaboxReducer
});
