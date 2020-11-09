/**
 * External dependancies
 */
import { Prompt, withRouter } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import { useToasts } from 'react-toast-notifications';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
  Button,
  Card,
  CardBody,
  CardDivider,
  CardHeader,
  CardFooter,
  SelectControl,
  __experimentalInputControl as InputControl,
  TextareaControl,
  Notice
} from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getScreenLink from '../../utils/getScreenLink';
import removeDuplicateAttachments from '../../utils/removeDuplicateAttachments';
import CreateSidebarLoader from '../components/loaders/CreateSidebarLoader';
import Metaboxes from '../components/metaboxes';
import SidebarAttachments from '../components/SidebarAttachments';

const CreateSidebar = props => {
  const { addToast } = useToasts();
  const [isSaving, setIsSaving] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [sidebarName, setSidebarName] = useState('');
  const [description, setDescription] = useState('');
  const [replacementId, setReplacementId] = useState('');
  const [sidebarNameError, setSidebarNameError] = useState(false);
  const setUniqueAttachments = newAttachments => setAttachments(removeDuplicateAttachments(newAttachments));
  const hasAttachments = () => attachments.length > 0;

  const defaultSidebars = useSelect(select => select(STORE_KEY).getDefaultSidebars());

  let defaultSidebarOptions = Object.keys(defaultSidebars).map(id => {
    return {
      label: defaultSidebars[id].name,
      value: id
    };
  });

  defaultSidebarOptions.push({
    label: replacementId
      ? __('— Deactivate Sidebar —', 'easy-custom-sidebars')
      : __('— Select a Sidebar —', 'easy-custom-sidebars'),
    value: ''
  });

  const dataLoaded = useSelect(select => {
    select(STORE_KEY).getDefaultSidebars();
    select(STORE_KEY).getPostTypes();
    select(STORE_KEY).getTaxonomies();

    return [
      select(STORE_KEY).hasFinishedResolution('getPostTypes'),
      select(STORE_KEY).hasFinishedResolution('getTaxonomies'),
      select(STORE_KEY).hasFinishedResolution('getDefaultSidebars')
    ].every(called => called);
  });

  useEffect(() => {
    if (sidebarName) {
      setSidebarNameError(false);
    }
  }, [sidebarName]);

  // Create sidebar.
  const { createSidebar } = useDispatch(STORE_KEY);
  const createSidebarAndRedirect = async () => {
    if (isSaving) {
      return;
    }

    if (!sidebarName) {
      setSidebarNameError(true);
    }

    if (sidebarName) {
      setIsSaving(true);
      const newSidebar = await createSidebar({ name: sidebarName, attachments, description, replacementId });
      resetSidebar();
      props.history.push(`${getScreenLink('edit', { sidebar: newSidebar.payload.sidebar.id })}`);
      addToast(sprintf(__('%s has been created.', 'easy-custom-sidebars'), newSidebar.payload.sidebar.title.rendered), {
        appearance: 'success',
        autoDismiss: true,
        placement: 'bottom-right'
      });
    }
  };

  const resetSidebar = () => {
    setSidebarName('');
    setAttachments([]);
    setDescription('');
    setReplacementId('');
  };

  // Track any changes made.
  const changesMade = () => {
    const changesMade = [sidebarName !== '', description !== '', replacementId !== '', attachments.length !== 0];
    return changesMade.some(hasChanged => hasChanged);
  };

  useBeforeunload(() => {
    if (changesMade()) {
      return __(
        'You have made changes to this sidebar that are not saved. Are you sure you want to leave this page?',
        'easy-custom-sidebars'
      );
    }
  });

  return dataLoaded ? (
    <div>
      <div className="container-fluid p-0">
        <div className="row">
          {/* Notice Example */}
          <div className="col-12 mb-3">
            <Notice className="m-0" status="info" isDismissible={false}>
              {__(
                'Create your new sidebar replacement below and click the create sidebar button to save your changes.',
                'easy-custom-sidebars'
              )}
            </Notice>

            {sidebarNameError && (
              <Notice className="m-0 mt-2" status="error" isDismissible={false}>
                {__('Please enter a valid name for your sidebar.', 'easy-custom-sidebars')}
              </Notice>
            )}
          </div>

          {/* Metaboxes */}
          <div className="col-12 col-md-5 col-xl-3 mb-4 mb-md-0">
            <Metaboxes attachments={attachments} setAttachments={setUniqueAttachments} />
          </div>

          {/* Sidebar Settings */}
          <div className="col">
            <Card className="ecs-settings">
              {/* Sidebar name and save action. */}
              <CardHeader className="d-block">
                <div className="row justify-content-between align-items-center">
                  <div className="col-6">
                    <InputControl
                      isFloatingLabel
                      className="ecs-settings__sidebar-name"
                      label="Sidebar Name"
                      value={sidebarName}
                      onChange={value => setSidebarName(value)}
                    />
                  </div>
                  <div className="col-auto">
                    <Button isBusy={isSaving} isPrimary onClick={createSidebarAndRedirect}>
                      {__('Create Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Sidebar attachments and settings. */}
              <CardBody>
                <h3>{__('Sidebar Replacements', 'easy-custom-sidebars')}</h3>
                <p>
                  {hasAttachments()
                    ? __(
                        `Drag each item into the order you prefer. Please ensure that any items added to this sidebar contain the default 'Sidebar to Replace' widget area selected in the sidebar properties below. Drag each item into the order you prefer.`,
                        'easy-custom-sidebars'
                      )
                    : __(
                        `Add items from the column on the left. Please ensure that any items added to this sidebar contain the default 'Sidebar to Replace' widget area selected in the sidebar properties below.`,
                        'easy-custom-sidebars'
                      )}
                </p>

                {/* Attachments. */}
                <SidebarAttachments attachments={attachments} setAttachments={setUniqueAttachments} />

                <CardDivider className="my-4" />

                {/* Properties. */}
                <h3>{__('Sidebar Properties', 'easy-custom-sidebars')}</h3>

                <SelectControl
                  className="ecs-settings__replacement-id mb-3"
                  label="Sidebar to Replace"
                  value={replacementId}
                  options={defaultSidebarOptions}
                  onChange={replacementId => setReplacementId(replacementId)}
                />

                <TextareaControl
                  label="Sidebar Description"
                  className="ecs-settings__description"
                  help="Description of the sidebar, displayed in the Widgets interface."
                  value={description}
                  onChange={description => setDescription(description)}
                />
              </CardBody>

              {/* Save/Delete actions. */}
              <CardFooter className="d-block">
                <div className="row justify-content-between">
                  <div className="col-auto">
                    <Button
                      isDestructive
                      onClick={() => {
                        const confirmDelete = confirm(
                          __(
                            `You are about to permanently delete this sidebar. 'Cancel' to stop, 'OK' to delete.`,
                            'easy-custom-sidebars'
                          )
                        );

                        if (confirmDelete === true) {
                          resetSidebar();
                          addToast(__('Your sidebar has been deleted.', 'easy-custom-sidebars'), {
                            appearance: 'info',
                            autoDismiss: false,
                            placement: 'bottom-right'
                          });
                        }
                      }}
                    >
                      {__('Delete Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button isBusy={isSaving} isPrimary onClick={createSidebarAndRedirect}>
                      {__('Create Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Prompt
        when={changesMade()}
        message={__(
          'You have made changes to this sidebar that are not saved. Are you sure you want to leave this page?',
          'easy-custom-sidebars'
        )}
        beforeUnload={true}
      />
    </div>
  ) : (
    <CreateSidebarLoader />
  );
};

export default withRouter(CreateSidebar);
