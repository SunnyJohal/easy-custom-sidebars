/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { Button, CheckboxControl, PanelBody, PanelRow } from '@wordpress/components';
import { useState } from '@wordpress/element';

const TemplateHierarchyMetabox = () => {
  const [isChecked, setChecked] = useState(false);

  return (
    <PanelBody title={__('Template Hierarchy', 'easy-custom-sidebars')} initialOpen={false}>
      <PanelRow className="mb-3">Need to fetch in all Template Hierarchy things here.</PanelRow>

      <div>
        <CheckboxControl label="404 Page Not Found" checked={isChecked} onChange={setChecked} />
        <CheckboxControl label="Author Archive" checked={isChecked} onChange={setChecked} />
        <CheckboxControl label="Blog Index Page" checked={isChecked} onChange={setChecked} />
        <CheckboxControl label="Date Archive" checked={isChecked} onChange={setChecked} />
        <CheckboxControl label="Search Results" checked={isChecked} onChange={setChecked} />
      </div>

      <PanelRow>
        <Button isLink onClick={() => {}}>
          Select All
        </Button>
        <Button isSecondary onClick={() => {}}>
          Add to Sidebar
        </Button>
      </PanelRow>
    </PanelBody>
  );
};

export default TemplateHierarchyMetabox;
