/**
 * External dependancies
 */
import { NavLink, withRouter } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { getQueryArg } from '@wordpress/url';

/**
 * Internal dependances
 */
import getScreenLink from '../../utils/getScreenLink';

const isActive = (_, location, screen) => {
  return getQueryArg(location.search, 'screen') === screen;
};

// Modify the edit link.
const Nav = props => {
  return (
    <>
      <h1 className="wp-heading-inline">{__('Sidebars', 'easy-custom-sidebars')}</h1>
      <a className="page-title-action hide-if-no-customize ml-2" href="#">
        {__('Manage with Live Preview', 'easy-custom-sidebars')}
      </a>

      <hr className="wp-header-end" />

      <div className="components-tab-panel__tabs my-3">
        <NavLink
          to={getScreenLink('create')}
          isActive={(_, location) => isActive(_, location, 'create')}
          className="components-button components-tab-panel__tabs-item"
          activeClassName="is-active"
        >
          {__('Create Sidebar', 'easy-custom-sidebars')}
        </NavLink>

        <NavLink
          to={getScreenLink('edit')}
          isActive={(_, location) => isActive(_, location, 'edit')}
          className="components-button components-tab-panel__tabs-item"
          activeClassName="is-active"
        >
          {__('Edit Sidebar', 'easy-custom-sidebars')}
        </NavLink>

        <NavLink
          to={getScreenLink('manage')}
          isActive={(_, location) => isActive(_, location, 'manage')}
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
