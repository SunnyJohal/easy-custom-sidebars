/**
 * External dependancies
 */
import { Redirect, Link, withRouter } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Button, Card, CardBody, SelectControl } from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getScreenLink from '../../utils/getScreenLink';

const sortSidebarsByTitle = sidebars => {
  return Object.keys(sidebars)
    .sort((a, b) => {
      const firstTitle = sidebars[a].title.rendered.toUpperCase();
      const secondTitle = sidebars[b].title.rendered.toUpperCase();

      if (firstTitle < secondTitle) {
        return -1;
      }

      if (firstTitle > secondTitle) {
        return 1;
      }

      return 0;
    })
    .map(id => ({
      label: sidebars[id].title.rendered,
      value: id
    }));
};

const SidebarSelector = props => {
  const { selectedSidebarId } = props;
  const [switchToSidebar, setSwitchToSidebar] = useState(selectedSidebarId);
  const [allSidebars, setAllSidebars] = useState([]);
  const sidebars = useSelect(select => select(STORE_KEY).getSidebars());

  useEffect(() => setAllSidebars(sortSidebarsByTitle(sidebars)), [sidebars]);

  return (
    <Card className="ecs-sidebar-selector">
      <CardBody className="row px-3 align-items-center">
        <div className="col-12 col-sm-auto mb-2 mb-sm-0 pr-sm-2">
          <span>{__('Select a sidebar to edit:', 'easy-custom-sidebars')}</span>
        </div>

        <div className="col-12 col-sm-auto mb-2 mb-sm-0 px-sm-0">
          <div className="d-flex no-wrap align-items-center">
            <div className="col pl-0 pr-2">
              <SelectControl
                options={allSidebars}
                value={switchToSidebar}
                onChange={sidebarId => {
                  setSwitchToSidebar(sidebarId);
                }}
                style={{ minWidth: 160, width: '100%', maxWidth: '100%' }}
              />
            </div>
            <div className="col-auto px-0">
              <Button
                isSecondary
                onClick={() => {
                  props.history.push(getScreenLink('edit', { sidebar: switchToSidebar }));
                }}
              >
                {__('Select', 'easy-custom-sidebars')}
              </Button>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-auto pl-sm-2">
          <span>
            <Link to={`${getScreenLink('create')}`}>{__('or create a new sidebar', 'easy-custom-sidebars')}</Link>
          </span>
        </div>
      </CardBody>
    </Card>
  );
};

export default withRouter(SidebarSelector);
