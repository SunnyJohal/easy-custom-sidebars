/**
 * External dependancies
 */
import { Redirect } from 'react-router-dom';

/**
 * Internal dependancies
 */
import getQueryFromUrl from '../../utils/getQueryFromUrl';
import getScreenLink from '../../utils/getScreenLink';
import About from './About';
import CreateSidebar from './CreateSidebar';
import EditSidebar from './EditSidebar';
import ManageSidebars from './ManageSidebars';

// Remove after.
import Nav from '../components/Nav';

function ScreenController() {
  switch (getQueryFromUrl('screen')) {
    case 'about':
      return <About />;
      break;

    case 'create':
      return (
        <div>
          <Nav />
          <CreateSidebar />
        </div>
      );
      break;

    case 'edit':
      return (
        <div>
          <Nav />
          <EditSidebar />
        </div>
      );
      break;

    case 'manage':
      return (
        <div>
          <Nav />
          <ManageSidebars />
        </div>
      );
      break;

    default:
      let defaultRedirect = easy_custom_sidebars.num_sidebars > 0 ? 'edit' : 'create';
      return (
        <div>
          <Redirect to={`${getScreenLink(defaultRedirect)}`} />
        </div>
      );
      break;
  }
}

export default ScreenController;
