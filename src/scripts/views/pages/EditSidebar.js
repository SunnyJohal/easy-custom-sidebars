/**
 * External dependancies
 */
import { Redirect } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getQueryFromUrl from '../../utils/getQueryFromUrl';
import getScreenLink from '../../utils/getScreenLink';

const EditSidebar = () => {
  useEffect(() => {
    console.log('at least this is firing');
    window.addEventListener('beforeunload', () => console.log('yaara why istnt this'));
  });

  const sidebarToEdit = getQueryFromUrl('sidebar');

  const sidebar = useSelect(select => {
    return select(STORE_KEY).getSidebar(sidebarToEdit);
  });

  // If no sidebar is passed in the url.
  // Attempt to get the first sidebar to edit.
  // If no sidebars exist then just redirect to the create screen.

  console.log('this is calling somehting', sidebar);

  return (
    <div>
      <h1>This is the edit screen</h1>
    </div>
  );
};

export default EditSidebar;

// Sidebar example fetch.
// apiFetch({ path: '/wp/v2/easy_custom_sidebars' }).then(posts => {
//   let sidebars = {};
//   posts.forEach(post => {
//     sidebars[post.id] = post;
//   });
//   console.log('sidebars', posts);
// });

// Post meta example fetch.
// path: '/wp/v2/types'      => Gets the posttypes
// path: '/wp/v2/taxonomies' => Gets the taxonomies
// path: '/wp/v2/categories' => Gets the terms
// path: '/wp/v2/users'      => Gets the authors

// Example urls with queries.

// $this->setup_post_type_meta_boxes();
// $this->setup_category_posts_boxes();
// $this->setup_taxonomy_meta_boxes();
// $this->setup_author_meta_box();
// $this->setup_template_meta_box();
