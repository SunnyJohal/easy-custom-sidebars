import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import apiFetch from '@wordpress/api-fetch';
import { getPath } from '@wordpress/url';
import getQueryFromUrl from './helpers/getQueryFromUrl';
import './admin.css';

const App = () => {
  apiFetch({ path: '/wp/v2/posts' }).then(posts => {
    console.log(posts);
  });

  return (
    <Router basename={getPath(easy_custom_sidebars.admin_url)}>
      <Controller />
    </Router>
  );
};

function Controller() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/themes.php?page=easy-custom-sidebars">Home</Link>
        </li>
        <li>
          <Link to="/themes.php?page=easy-custom-sidebars&screen=about">About</Link>
        </li>
        <li>
          <Link to="/themes.php?page=easy-custom-sidebars&screen=dashboard">Dashboard</Link>
        </li>
      </ul>

      <hr />
      <Screen name={getQueryFromUrl('screen')} />
    </div>
  );
}

// Break this components into "pages"
// in the app.
function Screen({ name }) {
  return name ? (
    <div>
      <p>The current screen id is {name}</p>
    </div>
  ) : (
    <div>This is the home screen</div>
  );
}

ReactDOM.render(<App />, document.getElementById('ecs-root'));
