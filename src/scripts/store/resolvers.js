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
  hydrateSidebarAttachments,
  hydratePostTypes,
  hydrateTaxonomies,
  hydratePostTypePosts,
  hydrateTaxonomyTerms
} from './actions';

/**
 * Sidebar Retrieval Resolvers
 */
export function* getSidebars() {
  const path = addQueryArgs('/wp/v2/easy-custom-sidebars', {
    per_page: -1,
    order: 'asc',
    orderby: 'title',
    _fields: ['id', 'title', 'meta']
  });
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
 * Sidebar Attachment Resolvers
 * @param {*} name
 */

export function* getAttachmentsForSidebar(id) {
  if (!id) {
    return;
  }

  const path = `easy-custom-sidebars/v1/attachments/${id}`;
  const attachments = yield apiFetch({ path });

  if (attachments) {
    return hydrateSidebarAttachments(id, attachments);
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
    per_page: 10,
    order: 'asc',
    orderby: 'title',
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

export function* getTaxonomyTerms({ slug, rest_base, page }) {
  const path = addQueryArgs(`/wp/v2/${rest_base}`, {
    page,
    per_page: 10,
    order: 'asc',
    orderby: 'name',
    _envelope: 1,
    _fields: ['id', 'name', 'taxonomy', 'link']
  });
  const terms = yield apiFetch({ path, method: 'GET' });

  if (terms && 200 === terms.status) {
    let termsById = {};
    for (let term of terms.body) {
      termsById[term.id] = term;
    }

    return hydrateTaxonomyTerms({
      slug,
      page,
      terms: termsById,
      totalItems: terms.headers['X-WP-Total'],
      totalPages: terms.headers['X-WP-TotalPages']
    });
  }

  return;
}
