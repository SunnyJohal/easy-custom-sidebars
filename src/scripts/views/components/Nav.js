/**
 * External dependancies
 */
import { NavLink, Link, withRouter } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { TabPanel } from '@wordpress/components';
import { getQueryArg } from '@wordpress/url';

/**
 * Internal dependances
 */
import getScreenLink from '../../utils/getScreenLink';
import getQueryFromUrl from '../../utils/getQueryFromUrl';

const isActive = (match, location, screen) => {
  return getQueryArg(location.search, 'screen') === screen;
};

// Modify the edit link.
const Nav = props => {
  return (
    <>
      <h1 className="wp-heading-inline">{__('Sidebars', 'easy-custom-sidebars')}</h1>
      <a className="page-title-action hide-if-no-customize ml-2" href="#">
        Manage with Live Preview
      </a>

      <hr className="wp-header-end" />

      <div className="components-tab-panel__tabs my-3">
        <NavLink
          to={getScreenLink('create')}
          isActive={(match, location) => isActive(match, location, 'create')}
          className="components-button components-tab-panel__tabs-item"
          activeClassName="is-active"
        >
          {__('Create Sidebar', 'easy-custom-sidebars')}
        </NavLink>

        <NavLink
          to={getScreenLink('edit')}
          isActive={(match, location) => isActive(match, location, 'edit')}
          className="components-button components-tab-panel__tabs-item"
          activeClassName="is-active"
        >
          {__('Edit Sidebars', 'easy-custom-sidebars')}
        </NavLink>

        <NavLink
          to={getScreenLink('manage')}
          isActive={(match, location) => isActive(match, location, 'manage')}
          className="components-button components-tab-panel__tabs-item"
          activeClassName="is-active"
        >
          {__('Manage Replacements', 'easy-custom-sidebars')}
        </NavLink>
      </div>
    </>
  );
};

export default withRouter(Nav);

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
