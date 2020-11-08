/**
 * WordPress dependancies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, CheckboxControl, PanelBody, PanelRow } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../../store';

const TemplateHierarchyMetabox = ({ attachments, setAttachments }) => {
  return (
    <PanelBody title={__('Template Hierarchy', 'easy-custom-sidebars')} initialOpen={false}>
      <TemplateHierarchyTemplates attachments={attachments} setAttachments={setAttachments} />
    </PanelBody>
  );
};

const TemplateHierarchyTemplates = props => {
  const [items, setItems] = useState([]);
  const templates = useSelect(select => select(STORE_KEY).getTemplates(), []);
  const templatesLoaded = useSelect(select => select(STORE_KEY).hasFinishedResolution('getTemplates'));

  useEffect(() => {
    if (templates) {
      setItems(templates);
    }
  }, [templates]);

  return (
    <div>
      {/* Items */}
      {templatesLoaded ? (
        <TemplateHierarchyAttachments items={items} setItems={setItems} />
      ) : (
        <p>{__('Loading...', 'easy-custom-sidebars')}</p>
      )}

      {/* Add Attachments */}
      {templatesLoaded && (
        <TemplateHierarchyActions
          items={items}
          setItems={setItems}
          addToSidebar={() => {
            const newAttachments = items
              .filter(item => item.checked)
              .map(item => {
                return {
                  id: item.id,
                  title: item.title,
                  label: __('Template', 'easy-custom-sidebars'),
                  link: addQueryArgs(`${easy_custom_sidebars.admin_url}edit.php`, { post_type: 'page' }),
                  data_type: item.data_type,
                  attachment_type: 'template_hierarchy'
                };
              });
            props.setAttachments([...props.attachments, ...newAttachments]);
          }}
        />
      )}
    </div>
  );
};

/**
 * Template Hierarchy Attachments Component
 */
const TemplateHierarchyAttachments = ({ items, setItems }) => {
  if (!items.length) {
    return null;
  }
  return (
    <ul>
      {items.map(({ id, title, checked }, i) => {
        return (
          <li key={`${i}-${id}`}>
            <CheckboxControl
              label={title}
              checked={checked ? true : false}
              onChange={checked => {
                const updatedItems = [...items];
                updatedItems[i].checked = checked;
                setItems(updatedItems);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Author Archive Metabox Actions Component
 */
const TemplateHierarchyActions = props => {
  const { items, setItems, addToSidebar } = props;
  const noItemSelected = items.every(item => !item.checked);

  return (
    <PanelRow>
      <Button
        isLink
        onClick={() =>
          setItems(
            items.map(item => {
              item.checked = noItemSelected ? true : false;
              return item;
            })
          )
        }
      >
        {noItemSelected ? __('Select All', 'easy-custom-sidebars') : __('Clear Selection', 'easy-custom-sidebars')}
      </Button>
      <Button
        isSecondary
        onClick={() => {
          addToSidebar();
          setItems(
            items.map(item => {
              item.checked = false;
              return item;
            })
          );
        }}
      >
        {__('Add to Sidebar', 'easy-custom-sidebars')}
      </Button>
    </PanelRow>
  );
};

export default TemplateHierarchyMetabox;
