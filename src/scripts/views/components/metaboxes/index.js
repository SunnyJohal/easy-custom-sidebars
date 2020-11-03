/**
 * WordPress dependancies
 */
import { useSelect } from '@wordpress/data';
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
        <PostTypesMetabox attachments={attachments} setAttachments={setAttachments} />
        <AllCategoryPostsMetabox attachments={attachments} setAttachments={setAttachments} />
        <TaxonomiesMetabox attachments={attachments} setAttachments={setAttachments} />
        <AuthorArchiveMetabox attachments={attachments} setAttachments={setAttachments} />
        <TemplateHierarchyMetabox attachments={attachments} setAttachments={setAttachments} />
      </Panel>
    )
  );
};

export default Metaboxes;
