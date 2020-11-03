/**
 * External Dependancies
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

/**
 * WordPress Dependancies
 */
import { getPath } from '@wordpress/url';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependancies
 */
import './store';
import { STORE_KEY } from './store';
import ScreenController from './views/pages/ScreenController';

const App = () => {
  // Preload state.
  useSelect(select => select(STORE_KEY).getSidebars());

  return (
    <Router basename={getPath(easy_custom_sidebars.admin_url)}>
      <ScreenController />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('ecs-root'));
