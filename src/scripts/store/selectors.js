// the selector returns a value from the state using the arguments provided.

export const getSidebars = state => {
  return state.sidebars || {};
};

export const getSidebar = (state, id) => {
  return state.sidebars[id] || {};
};
