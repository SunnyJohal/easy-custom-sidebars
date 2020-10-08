/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { Button, PanelBody, PanelRow } from '@wordpress/components';

const AuthorArchiveMetabox = () => {
  return (
    <PanelBody title={__('Author Archives', 'easy-custom-sidebars')} initialOpen={false}>
      <PanelRow>Need to fetch in all Author archives here.</PanelRow>
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

export default AuthorArchiveMetabox;
