/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { Button, PanelBody, PanelRow } from '@wordpress/components';

const AllCategoryPostsMetabox = () => {
  return (
    <PanelBody title={__('All Posts In Category', 'easy-custom-sidebars')} initialOpen={false}>
      <PanelRow>Need to fetch in all category posts here</PanelRow>
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

export default AllCategoryPostsMetabox;
