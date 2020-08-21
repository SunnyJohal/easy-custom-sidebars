/**
 * External dependancies
 */
import { Prompt } from 'react-router-dom';

/**
 * Internal dependancies
 */
import getQueryFromUrl from '../../utils/getQueryFromUrl';
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
      return (
        <div>
          <Nav />
          <ManageSidebars />
        </div>
      );
      break;
  }
}

export default ScreenController;
