/**
 * External dependancies
 */
import { Link } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependances
 */
import getScreenLink from '../../utils/getScreenLink';

// Modify the edit link.
const Nav = () => {
  return (
    <>
      <h1 className="wp-heading-inline">Sidebars</h1>
      <a className="page-title-action hide-if-no-customize" href="#">
        Manage with Live Preview
      </a>
      <hr className="wp-header-end" />
      <ul>
        <li>
          <Link to={getScreenLink()}>{__('Home', 'easy-custom-sidebars')}</Link>
        </li>
        <li>
          <Link to={getScreenLink('about')}>{__('About', 'easy-custom-sidebars')}</Link>
        </li>
        <li>
          <Link to={getScreenLink('create')}>{__('Create Sidebar', 'easy-custom-sidebars')}</Link>
        </li>
        <li>
          <Link to={getScreenLink('edit')}>{__('Edit Sidebar', 'easy-custom-sidebars')}</Link>
        </li>
        <li>
          <Link to={getScreenLink('manage')}>{__('Manage Sidebars', 'easy-custom-sidebars')}</Link>
        </li>
      </ul>
    </>
  );
};

export default Nav;

// NEW SIDEBAR - POST
// wp.apiFetch({
//   path: '/wp/v2/easy-custom-sidebars',
//   method: 'POST',
//   data: { title: 'Sunny Sidebar', status: 'publish' }
// }).then(res => console.log(res));

// UPDATE SIDEBAR - POST <id>
// wp.apiFetch({ path: 'wp/v2/easy-custom-sidebars/1835', method: 'POST', data: { title: "Yaara Sidebars" } }).then(res => console.log(res));

// GET SINGLE SIDEBAR - GET <id>
// wp.apiFetch({ path: '/wp/v2/easy-custom-sidebars/1835' }).then(res => console.log(res));

// GET ALL SIDEBARS - GET
// wp.apiFetch({ path: '/wp/v2/easy-custom-sidebars?per_page=-1&order=asc&orderby=title' }).then(res => console.log(res))

// DELETE SIDEBAR - DELETE <id>
// wp.apiFetch({ path: '/wp/v2/easy-custom-sidebars/1832?force=true', method: 'DELETE' }).then(res => console.log(res))
