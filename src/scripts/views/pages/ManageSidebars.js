/**
 * External Dependancies
 */
import { Link, withRouter } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

/**
 * WordPress dependancies
 */
import { __, _x } from '@wordpress/i18n';
import { Button, Card, CardBody, CardHeader, Spinner } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getScreenLink from '../../utils/getScreenLink';
import ManageSidebarsLoader from '../components/loaders/ManageSidebarsLoader';
import SidebarRow from '../components/SidebarRow';

const sortSidebarsByTitle = sidebars => {
  return Object.keys(sidebars).sort((a, b) => {
    const firstTitle = sidebars[a].title.rendered.toUpperCase();
    const secondTitle = sidebars[b].title.rendered.toUpperCase();

    if (firstTitle < secondTitle) {
      return -1;
    }

    if (firstTitle > secondTitle) {
      return 1;
    }

    return 0;
  });
};

/**
 * Manage Sidebars Component
 */
const ManageSidebars = props => {
  const [isDeleting, setIsDeleting] = useState(false);
  const sidebars = useSelect(select => select(STORE_KEY).getSidebars());
  const sidebarReqCompleted = useSelect(select => select(STORE_KEY).hasFinishedResolution('getSidebars'));
  const { addToast } = useToasts();
  const { deleteAllSidebars } = useDispatch(STORE_KEY);

  const sidebarList = sortSidebarsByTitle(sidebars).map((id, index, arr) => {
    const isLastItem = index === arr.length - 1;

    return (
      <SidebarRow
        key={id}
        sidebarId={id}
        sidebarTitle={sidebars[id].title.rendered}
        sidebarReplacementId={sidebars[id].meta.sidebar_replacement_id}
        appendDivider={!isLastItem}
      />
    );
  });

  return sidebarReqCompleted ? (
    <div>
      {/* Admin UI Headers */}
      <Card className="mb-3">
        <CardBody className="d-block py-0 px-3">
          <div className="row">
            <div className="col">
              <p>
                <span className="d-inline-block mr-2">
                  {__('Manage your sidebar replacements here or', 'easy-custom-sidebars')}
                </span>
                <Button isPrimary onClick={() => props.history.push(getScreenLink('create'))}>
                  {_x(
                    'Create a new Sidebar',
                    'Create sidebar button text on manage replacements screen.',
                    'easy-custom-sidebars'
                  )}
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
            <div className="col-4">{__('Sidebar', 'easy-custom-sidebars')}</div>
            <div className="col">{__('Default Sidebar to Replace', 'easy-custom-sidebar')}</div>
          </div>
        </CardHeader>
        <CardBody className="px-3">
          {sidebarList.length === 0 && (
            <p>
              {__('No sidebars exist.', 'easy-custom-sidebars')}{' '}
              <Link to={`${getScreenLink('create')}`}>{__('Create your first sidebar', 'easy-custom-sidebars')}</Link>
            </p>
          )}
          {sidebarList}
        </CardBody>
      </Card>

      {Object.keys(sidebars).length > 0 && (
        <div className="ecs-manage-sidebars__actions d-flex align-items-center mt-3">
          <Button
            isDestructive
            className="ecs-manage-sidebars__actions-delete"
            onClick={async () => {
              const userConfirmedDeletion = confirm(
                _x(
                  `Warning! You are about to permanently delete all sidebars. 'Cancel' to stop, 'OK' to delete.`,
                  'User confirmation message to delete all sidebars.',
                  'easy-custom-sidebars'
                )
              );

              if (userConfirmedDeletion) {
                setIsDeleting(true);

                try {
                  await deleteAllSidebars();
                  setIsDeleting(false);
                  addToast(__('All sidebars have been deleted.', 'easy-custom-sidebars'), {
                    appearance: 'info',
                    autoDismiss: true,
                    placement: 'bottom-right'
                  });
                } catch (error) {
                  setIsDeleting(false);
                }
              }
            }}
            disabled={isDeleting}
          >
            {_x('Delete All Sidebars', 'Button text to delete all sidebars.', 'easy-custom-sidebars')}
          </Button>
          {isDeleting && <Spinner />}
        </div>
      )}
    </div>
  ) : (
    <ManageSidebarsLoader />
  );
};

export default withRouter(ManageSidebars);
