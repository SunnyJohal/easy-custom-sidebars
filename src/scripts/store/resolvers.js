/**
 * WordPress dependancies
 */
import { apiFetch } from '@wordpress/data-controls';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependancies
 */
import { hydrateSidebars, hydrateDefaultSidebars, hydratePostTypes, hydrateTaxonomies } from './actions';

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

export function* getPostTypes() {
  const path = '/wp/v2/types';
  const posttypes = yield apiFetch({ path });

  if (posttypes) {
    return hydratePostTypes(posttypes);
  }

  return;
}

export function* getTaxonomies() {
  const path = '/wp/v2/taxonomies';
  const taxonomies = yield apiFetch({ path });

  if (taxonomies) {
    return hydrateTaxonomies(taxonomies);
  }
}
