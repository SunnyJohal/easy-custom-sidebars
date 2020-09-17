/**
 * WordPress dependancies
 */
import { Button, PanelBody, PanelRow } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

const PostTypeMetabox = props => {
  return (
    <>
      <PanelBody title="Pages" initialOpen={true}>
        <PanelRow>Need to put the tab panel in herezzz</PanelRow>
      </PanelBody>
      <PanelBody title="Posts" initialOpen={false}>
        <PanelRow>Need to put the tab panel in herezzz</PanelRow>
      </PanelBody>
    </>
  );
};

export default PostTypeMetabox;
