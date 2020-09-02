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
  TabPanel,
  __experimentalInputControl as InputControl,
  TextareaControl,
  Notice
} from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getScreenLink from '../../utils/getScreenLink';

// Happy path.
// 1. Make the api request.
// 2. Get the ID. Clear the inputs.
// 3. Redirect to the edit page.

const onSelect = tabName => {
  console.log('Selecting tab', tabName);
};

const MyTabPanel = () => (
  <TabPanel
    className="my-tab-panel"
    activeClass="active-tab"
    onSelect={onSelect}
    tabs={[
      {
        name: 'tab1',
        title: 'Most Recent',
        className: 'tab-one'
      },
      {
        name: 'tab2',
        title: 'View All',
        className: 'tab-two'
      },
      {
        name: 'tab3',
        title: 'Search',
        className: 'tab-three'
      }
    ]}
  >
    {tab => <p>{tab.title}</p>}
  </TabPanel>
);

const CreateSidebar = props => {
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarName, setSidebarName] = useState('');
  const [description, setDescription] = useState('');
  const [replacementId, setReplacementId] = useState('');

  const defaultSidebars = useSelect(select => {
    return select(STORE_KEY).getDefaultSidebars();
  }, {});

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
            <Panel>
              <PanelBody title="Pages" initialOpen={true}>
                <PanelRow>
                  <MyTabPanel />
                </PanelRow>
              </PanelBody>
              <PanelBody title="Posts" initialOpen={false}>
                <PanelRow>Need to put the tab panel in here</PanelRow>
              </PanelBody>
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

                        // Reset sidebar.
                        setSidebarName('');
                      }}
                    >
                      Create Sidebar
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Sidebar attachments and settings. */}
              <CardBody>
                <h3>Sidebar Replacements</h3>
                <p>
                  Add items from the column on the left. Please ensure that any items added to this sidebar contain the
                  default 'Sidebar to Replace' widget area selected in the sidebar properties below.
                </p>
                <CardDivider className="my-4" />

                <h3>Sidebar Properties</h3>

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
      <Prompt message={'are you sure you want to navigate away?'} beforeUnload={true} />
    </div>
  );
};

export default withRouter(CreateSidebar);
