/**
 * WordPress dependancies
 */
import { apiFetch } from '@wordpress/data-controls';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependancies
 */
import {
  hydrateSidebars,
  hydrateDefaultSidebars,
  hydratePostTypes,
  hydrateTaxonomies,
  hydratePostTypePosts
} from './actions';

/**
 * Sidebar Retrieval Resolvers
 */
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

/**
 * Posttype and Taxonomy Resolvers
 */
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

  return;
}

/**
 * Metabox Resolvers
 */
export function* getPostTypePosts({ slug, rest_base, page }) {
  const path = addQueryArgs(`/wp/v2/${rest_base}`, {
    page,
    _envelope: 1,
    _fields: ['id', 'title', 'type', 'link']
  });
  const posts = yield apiFetch({ path, method: 'GET' });

  if (posts && 200 === posts.status) {
    let postsById = {};

    for (let post of posts.body) {
      postsById[post.id] = post;
    }

    return hydratePostTypePosts({
      slug,
      page,
      posts: postsById,
      totalItems: posts.headers['X-WP-Total'],
      totalPages: posts.headers['X-WP-TotalPages']
    });
  }

  return;
}

export function* getTaxonomyTerms({ slug }) {}
