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

    case 'DELETE_SIDEBAR':
      let allSidebars = { ...state };
      delete allSidebars[action.payload.id];
      return allSidebars;
      break;

    case 'HYDRATE_SIDEBARS':
      return action.payload.sidebars;
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

export default combineReducers({
  sidebars: sidebarsReducer,
  defaultSidebars: defaultSidebarsReducer
});
