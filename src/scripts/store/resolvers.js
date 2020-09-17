/**
 * WordPress dependancies
 */
import { apiFetch } from '@wordpress/data-controls';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependancies
 */
import { hydrateSidebars, hydrateDefaultSidebars } from './actions';

// You implement control action creators in either action
// creators or resolvers that are defined as generators
// which yield action types.

// Resolvers must return, dispatch or yield action objects.
// Resolvers do not have to be generators but they do have
// to return (or yield, if generators) or dispatch action
// objects. If you have need for using controls (to handle
// async side-effects via control actions), then you’ll want
// to make your resolver a generator. Otherwise you can just
// dispatch or return action objects from the resolver.

export function* getSidebars() {
  const path = addQueryArgs('/wp/v2/easy-custom-sidebars', { per_page: -1, order: 'asc', orderby: 'title' });
  const sidebars = yield apiFetch({ path });

  if (sidebars) {
    let allSidebars = {};
    for (let sidebar of sidebars) {
      allSidebars[sidebar.id] = sidebar;
    }
    return hydrateSidebars(allSidebars);
  }

  return;
}

export function* getDefaultSidebars() {
  const path = 'easy-custom-sidebars/v1/default-sidebars';
  const defaultSidebars = yield apiFetch({ path });

  if (defaultSidebars) {
    return hydrateDefaultSidebars(defaultSidebars);
  }

  return;
}
