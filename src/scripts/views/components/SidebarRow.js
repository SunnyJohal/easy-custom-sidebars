/**
 * External Dependancies
 */
import { Link, withRouter } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

/**
 * WordPress dependencies
 */
import { __, _x, sprintf } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { CardDivider, SelectControl, Spinner } from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getScreenLink from '../../utils/getScreenLink';

/**
 * Get Default Sidebars
 * @param {*} sidebars
 */
const getDefaultSidebarOptions = (defaultSidebars, sidebarReplacementId) => {
  let sidebarOptions = Object.keys(defaultSidebars).map(id => {
    return {
      label: defaultSidebars[id].name,
      value: id
    };
  });

  sidebarOptions.push({
    label: sidebarReplacementId ? '— Deactivate Sidebar —' : '— Select a Sidebar —',
    value: ''
  });

  return sidebarOptions;
};

/**
 * Sidebar Row Component
 * @param {*} props
 */
const SidebarRow = props => {
  const { appendDivider, sidebarId, sidebarTitle, sidebarReplacementId } = props;
  const [isSaving, setIsSaving] = useState(false);
  const defaultSidebars = useSelect(select => select(STORE_KEY).getDefaultSidebars());
  const { addToast } = useToasts();
  const { updateSidebarReplacement, deleteSidebar } = useDispatch(STORE_KEY);

  return (
    <div className="ecs-manage-sidebars__sidebar">
      <div className="row align-items-center">
        {/* Sidebar name/actions */}
        <div className="col-4">
          <h4 className="ecs-manage-sidebars__sidebar-name mt-0 mb-1">
            <Link to={`${getScreenLink('edit', { sidebar: sidebarId })}`}>{sidebarTitle}</Link>
          </h4>

          <div className="ecs-manage-sidebars__sidebar-actions">
            <Link to={`${getScreenLink('edit', { sidebar: sidebarId })}`}>{__('Edit', 'easy-custom-sidebars')}</Link> |{' '}
            <a
              href="#"
              onClick={async event => {
                event.preventDefault();

                const userConfirmedDeletion = confirm(
                  _x(
                    `Warning! You are about to permanently delete this sidebar. 'Cancel' to stop, 'OK' to delete.`,
                    'User confirmation message to delete a sidebar.',
                    'easy-custom-sidebars'
                  )
                );

                if (userConfirmedDeletion) {
                  setIsSaving(true);
                  await deleteSidebar(sidebarId);
                  addToast(sprintf(__('%s has been deleted.', 'easy-custom-sidebars'), sidebarTitle), {
                    appearance: 'info',
                    autoDismiss: true,
                    placement: 'bottom-right'
                  });
                }
              }}
              disabled={isSaving}
            >
              {__('Delete', 'easy-custom-sidebars')}
            </a>
          </div>
        </div>

        {/* Sidebar replacement */}
        <div className="col">
          <div className="row no-wrap align-items-center">
            <div className="col">
              <SelectControl
                style={{ maxWidth: 400, width: '100%' }}
                className="ecs-settings__replacement-id"
                label={__('Sidebar to Replace', 'easy-custom-sidebars')}
                hideLabelFromVision={true}
                value={sidebarReplacementId}
                options={getDefaultSidebarOptions(defaultSidebars, sidebarReplacementId)}
                disabled={isSaving}
                onChange={async replacementId => {
                  setIsSaving(true);
                  await updateSidebarReplacement({ id: sidebarId, replacementId });
                  setIsSaving(false);
                  addToast(sprintf(__('%s has been updated.', 'easy-custom-sidebars'), sidebarTitle), {
                    appearance: 'success',
                    autoDismiss: true,
                    placement: 'bottom-right'
                  });
                }}
              />
            </div>

            {isSaving && (
              <div className="col-auto pl-0">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
      {appendDivider ? <CardDivider className="my-3" /> : null}
    </div>
  );
};

export default withRouter(SidebarRow);
