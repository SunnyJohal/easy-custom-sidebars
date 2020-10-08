/**
 * WordPress dependancies
 */
import { Button, PanelBody, PanelRow, __experimentalInputControl as InputControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../../store';

const PostTypePosts = props => {
  const { name, slug, rest_base } = props;

  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      <h1>
        This is the {name} - {num}
      </h1>
    </div>
  );
};

const PostTypesMetabox = props => {
  const { attachments, setAttachments } = props;

  const posttypes = useSelect(select => {
    return select(STORE_KEY).getPostTypes();
  });

  const publicPosttypes = Object.keys(posttypes).filter(
    posttype => !['attachment', 'sidebar_instance', 'wp_block'].includes(posttype)
  );

  const metaboxes = publicPosttypes.map((posttypeName, i) => {
    const isFirstItem = i === 0;
    const { name, rest_base, slug } = posttypes[posttypeName];

    return (
      <PanelBody title={name} key={slug} initialOpen={isFirstItem}>
        <InputControl label={`Search ${name}`} onChange={search => {}} />

        <PanelRow>
          So the name is {name} and the rest base is {rest_base}
        </PanelRow>

        <PostTypePosts name={name} slug={slug} rest_base={rest_base} />

        <PanelRow>
          <Button isLink onClick={() => {}}>
            Select All
          </Button>
          <Button
            isSecondary
            onClick={() => {
              setAttachments([
                ...attachments,
                {
                  id: `item-${new Date().getTime()}`,
                  content: `item ok`,
                  example: 'This can be anything'
                }
              ]);
            }}
          >
            Add to Sidebar
          </Button>
        </PanelRow>
      </PanelBody>
    );
  });

  return metaboxes;
};

export default PostTypesMetabox;
