/**
 * External dependancies
 */
import { Prompt, withRouter } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
  Button,
  Card,
  CardBody,
  CardDivider,
  CardHeader,
  CardFooter,
  Panel,
  PanelBody,
  PanelRow,
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
import PostTypeMetabox from '../components/metaboxes/PostTypeMetabox';

const CreateSidebar = props => {
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarName, setSidebarName] = useState('');
  const [description, setDescription] = useState('');
  const [replacementId, setReplacementId] = useState('');

  const hasFinishedResolution = useSelect(select => {
    return select(STORE_KEY).hasFinishedResolution('getDefaultSidebars');
  });

  const defaultSidebars = useSelect(select => {
    return select(STORE_KEY).getDefaultSidebars();
  });

  let defaultSidebarOptions = Object.keys(defaultSidebars).map(id => {
    return {
      label: defaultSidebars[id].name,
      value: id
    };
  });

  defaultSidebarOptions.push({
    label: replacementId ? '— Deactivate Sidebar —' : '— Select a Sidebar —',
    value: ''
  });

  const { createSidebar } = useDispatch(STORE_KEY);

  const resetSidebar = () => {
    setSidebarName('');
    setDescription('');
    setReplacementId('');
  };

  // TODO: Add for attachments.
  const changesMade = () => {
    if (sidebarName !== '' || description !== '' || replacementId !== '') {
      return true;
    }

    return false;
  };

  return (
    <div>
      <div className="container-fluid p-0">
        <div className="row">
          {/* Notice Example */}
          <div className="col-12 mb-3">
            <div
              style={{
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Notice className="m-0" status="info" isDismissible={false}>
                Create your new sidebar replacement below and click the create sidebar button to save your changes.
              </Notice>
            </div>
          </div>

          {/* Metaboxes */}
          <div className="col-12 col-md-5 col-xl-3 mb-4 mb-md-0">
            <Panel className="ecs-metaboxes">
              <PostTypeMetabox />
            </Panel>
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
                    <Button
                      isPrimary
                      onClick={() => {
                        // Lock sidebar creation while saving.
                        console.log('ok create the sidebar and redirect, maybe show a spinner', sidebarName);

                        createSidebar({ name: sidebarName }).then(action => {
                          props.history.push(`${getScreenLink('edit', { sidebar: action.payload.sidebar.id })}`);
                        });

                        resetSidebar();
                      }}
                    >
                      {__('Create Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Sidebar attachments and settings. */}
              <CardBody>
                <h3>{__('Sidebar Replacements', 'easy-custom-sidebars')}</h3>
                <p>
                  Add items from the column on the left. Please ensure that any items added to this sidebar contain the
                  default 'Sidebar to Replace' widget area selected in the sidebar properties below.
                </p>

                {/* Attachments. */}
                {/* 
                  Sortable.
                  Add attachment to the sidebar.
                  Find out the shape of data.

                  Key Data:
                  - menu-item-object-id (id of the post or the taxonomy term etc)
                  - menu-item-object (posttype slug or taxonomy slug or template hierarchy)
                  - menu-item-type: post_type | post_type_all | category_posts | taxonomy | taxonomy_all | author_archive | template_hierarchy
                */}

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
                          `You are about to permanently delete this sidebar. 'Cancel' to stop, 'OK' to delete.`
                        );

                        if (confirmDelete === true) {
                          resetSidebar();
                        }
                      }}
                    >
                      {__('Delete Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button isPrimary onClick={() => {}}>
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
        message={__('are you sure you want to navigate away?', 'easy-custom-sidebars')}
        beforeUnload={true}
      />
    </div>
  );
};

export default withRouter(CreateSidebar);
