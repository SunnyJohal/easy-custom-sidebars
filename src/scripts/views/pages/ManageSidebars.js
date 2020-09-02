/**
 * External Dependancies
 */
import { Link, withRouter } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { Button, Card, CardBody, CardDivider, CardHeader, SelectControl, Spinner } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getScreenLink from '../../utils/getScreenLink';

const ManageSidebars = props => {
  const hasFinishedResolution = useSelect(select => {
    return select(STORE_KEY).hasFinishedResolution('getSidebars');
  });

  const sidebars = useSelect(select => {
    return select(STORE_KEY).getSidebars();
  });

  const { deleteSidebar } = useDispatch(STORE_KEY);

  const defaultSidebars = useSelect(select => {
    return select(STORE_KEY).getDefaultSidebars();
  });

  const sidebarList = Object.keys(sidebars).map((id, index, arr) => {
    let defaultSidebarOptions = Object.keys(defaultSidebars).map(id => {
      return {
        label: defaultSidebars[id].name,
        value: id
      };
    });

    defaultSidebarOptions.push({
      label: undefined ? '— Deactivate Sidebar —' : '— Select a Sidebar —',
      value: ''
    });

    const isLastItem = index === arr.length - 1;

    return (
      <div className="ecs-manage-sidebars__sidebar" key={id}>
        <div className="row align-items-center">
          <div className="col-4">
            <h4 className="ecs-manage-sidebars__sidebar-name mt-0 mb-1">
              <Link to={`${getScreenLink('edit', { sidebar: id })}`}>{sidebars[id].title.rendered}</Link>
            </h4>
            <div className="ecs-manage-sidebars__sidebar-actions">
              <Link to={`${getScreenLink('edit', { sidebar: id })}`}>{__('Edit', 'easy-custom-sidebars')}</Link> |{' '}
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  deleteSidebar(id);
                }}
              >
                {__('Delete', 'easy-custom-sidebars')}
              </a>
            </div>
          </div>
          <div className="col">
            <div className="row no-wrap align-items-center">
              <div className="col">
                <SelectControl
                  style={{ maxWidth: 400, width: '100%' }}
                  className="ecs-settings__replacement-id"
                  label="Sidebar to Replace"
                  hideLabelFromVision={true}
                  value={''}
                  options={defaultSidebarOptions}
                  onChange={replacementId => console.log('selected thing is')}
                />
              </div>

              <div className="col-auto pl-0">
                <Spinner />
              </div>
            </div>
          </div>
        </div>
        {isLastItem ? null : <CardDivider className="my-3" />}
      </div>
    );
  });

  return hasFinishedResolution ? (
    <div>
      {/* Admin UI Headers */}
      <Card className="mb-3">
        <CardBody className="d-block py-0 px-3">
          <div className="row">
            <div className="col">
              <p>
                <span className="d-inline-block mr-2">Manage your sidebars here or</span>
                <Button
                  isPrimary
                  onClick={() => {
                    props.history.push(getScreenLink('create'));
                  }}
                >
                  Create a new Sidebar
                </Button>
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* List of current sidebars. */}
      <Card className="ecs-manage-sidebars">
        <CardHeader className="d-block px-3">
          <div className="row">
            <div className="col-4">Sidebar</div>
            <div className="col">Default Sidebar to Replace</div>
          </div>
        </CardHeader>
        <CardBody className="px-3">{sidebarList}</CardBody>
      </Card>

      <Button isDestructive className="ecs-manage-sidebars__btn-delete mt-3">
        {__('Delete All Sidebars', 'easy-custom-sidebars')}
      </Button>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default withRouter(ManageSidebars);
