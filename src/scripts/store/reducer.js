import { combineReducers } from '@wordpress/data';

export const getSidebars = (state = [], action) => {
  switch (action.type) {
    case 'GET_SIDEBARS':
      return state;

    default:
      return state;
  }
};

export default combineReducers({
  sidebars: getSidebars
});
