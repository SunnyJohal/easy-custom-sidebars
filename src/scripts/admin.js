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

/**
 * Internal Dependancies
 */
import './store';
import ScreenController from './views/pages/ScreenController';

const App = () => {
  return (
    <Router basename={getPath(easy_custom_sidebars.admin_url)}>
      <ScreenController />
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('ecs-root'));
