/**
 * WordPress dependancies
 */
import { Button, PanelBody, PanelRow } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../../store';

const TaxonomiesMetabox = props => {
  const taxonomies = useSelect(select => {
    return select(STORE_KEY).getTaxonomies();
  });

  const metaboxes = Object.keys(taxonomies).map(taxonomyName => {
    const { name, rest_base, slug } = taxonomies[taxonomyName];

    return (
      <PanelBody title={name} key={slug} initialOpen={false}>
        <PanelRow>
          So the name is {name} and the rest base is {rest_base}
        </PanelRow>
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
  });

  return metaboxes;
};

export default TaxonomiesMetabox;
