import React from 'react';
import ReactDOM from 'react-dom';
import './admin.css';

const App = () => {
  return (
    <div>
      <h1 className="ecs-heading">
        This is being rendered by React with react being fetched externally.
      </h1>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('ecs-root'));
