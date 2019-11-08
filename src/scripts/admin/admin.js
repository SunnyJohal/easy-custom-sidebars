import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import './admin.css';

const App = () => {
  return (
    <div style={{ maxWidth: '320px' }}>
      <h1 className="ecs-heading">Custom Sidebars</h1>
      <Panel header="My Panel">
        <PanelBody title="My Block Settings" initialOpen={true}>
          <PanelRow>My Panel Inputs and Labels</PanelRow>
        </PanelBody>
      </Panel>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('ecs-root'));
