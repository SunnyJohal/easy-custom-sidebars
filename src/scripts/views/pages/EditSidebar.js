/**
 * External dependancies
 */
import { Prompt, withRouter } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import { useToasts } from 'react-toast-notifications';

/**
 * WordPress dependancies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import {
  Button,
  Card,
  CardDivider,
  CardHeader,
  CardBody,
  CardFooter,
  __experimentalInputControl as InputControl,
  SelectControl,
  TextareaControl,
  Notice
} from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getQueryFromUrl from '../../utils/getQueryFromUrl';
import getScreenLink from '../../utils/getScreenLink';
import removeDuplicateAttachments from '../../utils/removeDuplicateAttachments';
import SidebarSelector from '../components/SidebarSelector';
import EditSidebarsLoader from '../components/loaders/EditSidebarsLoader';
import Metaboxes from '../components/metaboxes';
import SidebarAttachments from '../components/SidebarAttachments';

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
 * Edit Sidebar Component.
 */
const EditSidebar = props => {
  const { addToast } = useToasts();
  const hasFinishedResolution = useSelect(select => {
    select(STORE_KEY).getPostTypes();
    select(STORE_KEY).getTaxonomies();

    return [
      select(STORE_KEY).hasFinishedResolution('getPostTypes'),
      select(STORE_KEY).hasFinishedResolution('getTaxonomies'),
      select(STORE_KEY).hasFinishedResolution('getSidebars')
    ].every(called => called);
  });

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

  const allSidebars = useSelect(select => select(STORE_KEY).getSidebars());
  let sidebarToEdit = getQueryFromUrl('sidebar');

  if (!sidebarToEdit && hasFinishedResolution) {
    const [firstSidebar] = sortSidebarsByTitle(allSidebars);
    sidebarToEdit = firstSidebar;
  }

  useEffect(() => {
    let isMounted = true;
    if (hasFinishedResolution && Object.keys(allSidebars).length === 0) {
      props.history.push(getScreenLink('create'));
    }
    return () => {
      isMounted = false;
    };
  }, [allSidebars]);

  const sidebar = useSelect(select => select(STORE_KEY).getSidebar(sidebarToEdit));
  const [isSaving, setIsSaving] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [sidebarName, setSidebarName] = useState('');
  const [description, setDescription] = useState('');
  const [replacementId, setReplacementId] = useState('');
  const [changesMade, setChangesMade] = useState(false);
  const [sidebarNameError, setSidebarNameError] = useState(false);
  const hasAttachments = () => attachments.length > 0;

  const setUniqueAttachments = newAttachments => {
    setAttachments(removeDuplicateAttachments(newAttachments));
    setChangesMade(true);
  };

  // Sync saved attachment state.
  const savedAttachments = useSelect(select => select(STORE_KEY).getAttachmentsForSidebar(sidebarToEdit));
  const attachmentsLoaded = useSelect(select =>
    select(STORE_KEY).hasFinishedResolution('getAttachmentsForSidebar', [sidebarToEdit])
  );
  useEffect(() => setAttachments(savedAttachments), [savedAttachments.length]);

  // Sync state with saved sidebar.
  useEffect(() => {
    setIsSaving(false);
    setChangesMade(false);

    if (Object.keys(sidebar).length > 0) {
      setSidebarName(sidebar.title.rendered);
      setDescription(sidebar.meta.sidebar_description);
      setReplacementId(sidebar.meta.sidebar_replacement_id);
    }
  }, [sidebar]);

  /**
   * Update Sidebar
   */
  const { updateSidebar } = useDispatch(STORE_KEY);
  const updateSidebarAndRedirect = async () => {
    if (isSaving || !attachmentsLoaded) {
      return;
    }

    if (!sidebarName) {
      setSidebarNameError(true);
    }

    if (sidebarName) {
      setIsSaving(true);
      await updateSidebar({
        id: sidebarToEdit,
        name: sidebarName,
        attachments,
        description,
        replacementId
      });
      addToast(sprintf(__('%s has been updated.', 'easy-custom-sidebars'), sidebarName), {
        appearance: 'success',
        autoDismiss: true,
        placement: 'bottom-right'
      });
    }
  };

  /**
   * Delete Sidebar
   */
  const { deleteSidebar } = useDispatch(STORE_KEY);
  const deleteSidebarAndRedirect = async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    await deleteSidebar(sidebarToEdit);
    props.history.push(getScreenLink('edit'));
    addToast(sprintf(__('%s has been deleted.', 'easy-custom-sidebars'), sidebarName), {
      appearance: 'info',
      autoDismiss: true,
      placement: 'bottom-right'
    });
  };

  /**
   * Prompt for unsaved changes.
   */
  useBeforeunload(() => {
    if (changesMade) {
      return __(
        'You have made changes to this sidebar that are not saved. Are you sure you want to leave this page?',
        'easy-custom-sidebars'
      );
    }
  });

  return hasFinishedResolution ? (
    <div>
      <div className="container-fluid p-0">
        <div className="row">
          {/* Sidebar selector */}
          <div className="col-12 mb-3">
            <SidebarSelector selectedSidebarId={sidebarToEdit} />
          </div>

          {sidebarNameError && (
            <div className="col-12 mb-3">
              <Notice className="m-0" status="error" isDismissible={false}>
                {__('Please enter a valid name for your sidebar.', 'easy-custom-sidebars')}
              </Notice>
            </div>
          )}

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
                      onChange={value => {
                        setSidebarName(value);
                        setChangesMade(true);
                      }}
                    />
                  </div>
                  <div className="col-auto">
                    <Button isBusy={isSaving} isPrimary onClick={updateSidebarAndRedirect}>
                      {__('Save Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Sidebar attachment and settings */}
              <CardBody>
                <h3>{sprintf(__('Sidebar Replacements for: %s'), sidebarName)}</h3>
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
                  label={__('Sidebar to Replace', 'easy-custom-sidebars')}
                  value={replacementId}
                  options={defaultSidebarOptions}
                  onChange={replacementId => {
                    setReplacementId(replacementId);
                    setChangesMade(true);
                  }}
                />

                <TextareaControl
                  label="Sidebar Description"
                  className="ecs-settings__description"
                  help={__('Description of the sidebar, displayed in the Widgets interface.', 'easy-custom-sidebars')}
                  value={description}
                  onChange={description => {
                    setDescription(description);
                    setChangesMade(true);
                  }}
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
                          `You are about to permanently delete this sidebar. 'Cancel' to stop, 'OK' to delete.`
                        );

                        if (confirmDelete === true) {
                          deleteSidebarAndRedirect();
                        }
                      }}
                    >
                      {__('Delete Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>

                  <div className="col-auto">
                    <Button isBusy={isSaving} isPrimary onClick={updateSidebarAndRedirect}>
                      {__('Save Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Prompt
        when={changesMade}
        message={__(
          'You have made changes to this sidebar that are not saved. Are you sure you want to leave this page?',
          'easy-custom-sidebars'
        )}
        beforeUnload={true}
      />
    </div>
  ) : (
    <EditSidebarsLoader />
  );
};

export default withRouter(EditSidebar);
