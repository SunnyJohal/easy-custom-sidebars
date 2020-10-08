/**
 * External dependancies
 */
import { Redirect, Link, withRouter } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
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
  Panel,
  PanelBody,
  PanelRow,
  TextareaControl
} from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getQueryFromUrl from '../../utils/getQueryFromUrl';
import getScreenLink from '../../utils/getScreenLink';
import SidebarSelector from '../components/SidebarSelector';
import EditSidebarsLoader from '../components/loaders/EditSidebarsLoader';
import SidebarAttachments from '../components/SidebarAttachments';

const EditSidebar = props => {
  const hasFinishedResolution = useSelect(select => {
    return select(STORE_KEY).hasFinishedResolution('getSidebars');
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

  const allSidebars = useSelect(select => {
    return select(STORE_KEY).getSidebars();
  });

  let sidebarToEdit = getQueryFromUrl('sidebar');

  if (!sidebarToEdit && hasFinishedResolution) {
    const [firstSidebar] = Object.keys(allSidebars).sort((a, b) => {
      const firstTitle = allSidebars[a].title.rendered.toUpperCase();
      const secondTitle = allSidebars[b].title.rendered.toUpperCase();

      if (firstTitle < secondTitle) {
        return -1;
      }

      if (firstTitle > secondTitle) {
        return 1;
      }

      return 0;
    });
    sidebarToEdit = firstSidebar;
  }

  if (hasFinishedResolution && Object.keys(allSidebars).length === 0) {
    props.history.push(getScreenLink('create'));
  }

  const sidebar = useSelect(select => {
    return select(STORE_KEY).getSidebar(sidebarToEdit);
  });

  // If no sidebar is passed in the url.
  // Attempt to get the first sidebar to edit.
  // If no sidebars exist then just redirect to the create screen.

  const { deleteSidebar, updateSidebar } = useDispatch(STORE_KEY);

  const [isSaving, setIsSaving] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [sidebarName, setSidebarName] = useState('');
  const [description, setDescription] = useState('');
  const [replacementId, setReplacementId] = useState('');

  // Sync state with saved sidebar.
  useEffect(() => {
    if (Object.keys(sidebar).length > 0) {
      setSidebarName(sidebar.title.rendered);
      setDescription(sidebar.meta.sidebar_description);
      setReplacementId(sidebar.meta.sidebar_replacement_id);
    }
  }, [sidebar]);

  return hasFinishedResolution ? (
    <div>
      <div className="container-fluid p-0">
        <div className="row">
          {/* Sidebar selector */}
          <div className="col-12 mb-3">
            <SidebarSelector selectedSidebarId={sidebarToEdit} />
          </div>

          {/* Metaboxes */}
          <div className="col-12 col-md-5 col-xl-3 mb-4 mb-md-0">
            <Panel className="ecs-metaboxes">
              <PanelBody title="Pages" initialOpen={true}>
                <PanelRow>
                  <PanelRow>Need to put the tab panel in here</PanelRow>
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

                        // createSidebar({ name: sidebarName }).then(action => {
                        //   props.history.push(`${getScreenLink('edit', { sidebar: action.payload.sidebar.id })}`);
                        // });

                        resetSidebar();
                      }}
                    >
                      {__('Save Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Sidebar attachment and settings */}
              <CardBody>
                <h3>
                  {__('Sidebar Replacements for:', 'easy-custom-sidebars')} {sidebar.title.rendered}
                </h3>
                <p>
                  Add items from the column on the left. Please ensure that any items added to this sidebar contain the
                  default 'Sidebar to Replace' widget area selected in the sidebar properties below.
                </p>

                {/* Attachments. */}
                <SidebarAttachments attachments={attachments} setAttachments={setAttachments} />
                {/* 
                  Sortable.
                  Add attachment to the sidebar.
                  Find out the shape of data.
                  
                */}

                <CardDivider className="my-4" />

                {/* Properties. */}
                <h3>{__('Sidebar Properties', 'easy-custom-sidebars')}</h3>

                <SelectControl
                  className="ecs-settings__replacement-id mb-3"
                  label={__('Sidebar to Replace', 'easy-custom-sidebars')}
                  value={replacementId}
                  options={defaultSidebarOptions}
                  onChange={replacementId => setReplacementId(replacementId)}
                />

                <TextareaControl
                  label="Sidebar Description"
                  className="ecs-settings__description"
                  help={__('Description of the sidebar, displayed in the Widgets interface.', 'easy-custom-sidebars')}
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
                      {__('Save Sidebar', 'easy-custom-sidebars')}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <EditSidebarsLoader />
  );
};

export default withRouter(EditSidebar);

// Sidebar example fetch.
// apiFetch({ path: '/wp/v2/easy_custom_sidebars' }).then(posts => {
//   let sidebars = {};
//   posts.forEach(post => {
//     sidebars[post.id] = post;
//   });
//   console.log('sidebars', posts);
// });

// Post meta example fetch.
// path: '/wp/v2/types'      => Gets the posttypes
// path: '/wp/v2/taxonomies' => Gets the taxonomies
// path: '/wp/v2/categories' => Gets the terms
// path: '/wp/v2/users'      => Gets the authors

// Example urls with queries.

// $this->setup_post_type_meta_boxes();
// $this->setup_category_posts_boxes();
// $this->setup_taxonomy_meta_boxes();
// $this->setup_author_meta_box();
// $this->setup_template_meta_box();
