/**
 * WordPress dependancies
 */
import { addQueryArgs } from '@wordpress/url';

const getScreenLink = (screen, queryArgs = {}) => {
  return addQueryArgs('/themes.php', { page: 'easy-custom-sidebars', screen, ...queryArgs });
};

export default getScreenLink;
