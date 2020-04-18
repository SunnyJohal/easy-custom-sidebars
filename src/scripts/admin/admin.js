import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import apiFetch from '@wordpress/api-fetch';
import { getPath } from '@wordpress/url';
import getQueryFromUrl from './utils/getQueryFromUrl';
import './admin.css';

// TODO: Move view logic to containers and components.
const App = () => {
  // Sidebar example fetch.
  apiFetch({ path: '/wp/v2/easy_custom_sidebars' }).then(posts => {
    let sidebars = {};
    posts.forEach(post => {
      sidebars[post.id] = post;
    });
    console.log(sidebars);
  });

  // Post meta example fetch.
  // path: '/wp/v2/types'      => Gets the posttypes
  // path: '/wp/v2/taxonomies' => Gets the taxonomies
  // path: '/wp/v2/categories' => Gets the terms
  // path: '/wp/v2/users'      => Gets the authors

  // $this->setup_post_type_meta_boxes();
  // $this->setup_category_posts_boxes();
  // $this->setup_taxonomy_meta_boxes();
  // $this->setup_author_meta_box();
  // $this->setup_template_meta_box();

  return (
    <Router basename={getPath(easy_custom_sidebars.admin_url)}>
      <Controller />
    </Router>
  );
};

function Controller() {
  const screen = getQueryFromUrl('screen');

  return screen === 'about' ? (
    <div>
      <h1>Put the about content here!</h1>
      <p>Reset some post meta to indicate it updating?</p>
    </div>
  ) : (
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
      <Screen name={screen} />
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
