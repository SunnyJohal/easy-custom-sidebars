/**
 * External dependancies
 */
import uniqWith from 'lodash.uniqwith';
import isEqual from 'lodash.isequal';

const removeDuplicateAttachments = attachments => {
  return uniqWith(attachments, isEqual);
};

export default removeDuplicateAttachments;
