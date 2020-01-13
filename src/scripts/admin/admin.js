import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

// import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import "./admin.css";

// Redux State
// List of sidebars.
// Selected sidebar to edit.

// Potential Actions
// Create sidebar
// Select sidebar to edit.
// Add item.

// Steps for navigation.
// Dynamically get the admin url path and add it to the router basename.
// Add a rewrite rule in the server that
// 1. Redirects the request to the settings page/Loads the settings template.
// 2. Preserves the query params.

// Steps for @wordpress/data.
// 1. Define any middleware.
// 2. Import and combine all of the reducers.
// 3. Create the central store that will hold the app state.
// 4. Define any action creators that will dispatch any actions to the store.
const App = () => {
  return (
    <Router basename="/plugins-site/wp-admin/themes.php?page=easy-custom-sidebars">
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/about">
            <About />
          </Route>

          <Route path="/dashboard">
            <Dashboard />
          </Route>

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

// You can think of these components as "pages"
// in your app.

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("ecs-root"));
