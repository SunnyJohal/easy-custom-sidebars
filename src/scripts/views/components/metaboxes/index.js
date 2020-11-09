/**
 * WordPress dependancies
 */
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { Panel } from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../../store';
import PostTypesMetabox from './PostTypesMetabox';
import AllCategoryPostsMetabox from './AllCategoryPostsMetabox';
import TaxonomiesMetabox from './TaxonomiesMetabox';
import AuthorArchiveMetabox from './AuthorArchiveMetabox';
import TemplateHierarchyMetabox from './TemplateHierarchyMetabox';

const Metaboxes = ({ attachments, setAttachments }) => {
  const [openMetabox, setOpenMetabox] = useState('ecs-metabox-posttype-post');
  const metaboxesDetermined = useSelect(select => {
    select(STORE_KEY).getPostTypes();
    select(STORE_KEY).getTaxonomies();

    return [
      select(STORE_KEY).hasFinishedResolution('getPostTypes'),
      select(STORE_KEY).hasFinishedResolution('getTaxonomies')
    ].every(called => called);
  });

  return (
    metaboxesDetermined && (
      <Panel className="ecs-metaboxes">
        <PostTypesMetabox
          attachments={attachments}
          setAttachments={setAttachments}
          openMetabox={openMetabox}
          setOpenMetabox={setOpenMetabox}
        />
        <AllCategoryPostsMetabox
          attachments={attachments}
          setAttachments={setAttachments}
          openMetabox={openMetabox}
          setOpenMetabox={setOpenMetabox}
        />
        <TaxonomiesMetabox
          attachments={attachments}
          setAttachments={setAttachments}
          openMetabox={openMetabox}
          setOpenMetabox={setOpenMetabox}
        />
        <AuthorArchiveMetabox
          attachments={attachments}
          setAttachments={setAttachments}
          openMetabox={openMetabox}
          setOpenMetabox={setOpenMetabox}
        />
        <TemplateHierarchyMetabox
          attachments={attachments}
          setAttachments={setAttachments}
          openMetabox={openMetabox}
          setOpenMetabox={setOpenMetabox}
        />
      </Panel>
    )
  );
};

export default Metaboxes;
