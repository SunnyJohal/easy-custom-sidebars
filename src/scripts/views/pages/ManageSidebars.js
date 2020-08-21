/**
 * External Dependancies
 */
import { Link } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { Button, Card, CardBody, CardDivider, CardHeader, CardFooter, Notice } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../store';
import getScreenLink from '../../utils/getScreenLink';

const ManageSidebars = () => {
  const sidebars = useSelect(select => {
    return select(STORE_KEY).getSidebars();
  });

  const hasFinishedResolution = useSelect(select => {
    return select(STORE_KEY).hasFinishedResolution('getSidebars');
  });

  const { deleteSidebar } = useDispatch(STORE_KEY);

  const list = Object.keys(sidebars).map(id => {
    return (
      <li key={id}>
        <span>{sidebars[id].title.rendered}</span>
        <Link to={`${getScreenLink('edit', { sidebar: id })}`}>Edit</Link> |
        <button onClick={() => deleteSidebar(id)}>Delete</button>
      </li>
    );
  });

  return hasFinishedResolution ? (
    <div>
      <div className="container-fluid">
        <Card className="row">
          <div className="col">
            <p>
              Manage your sidebars here or <Button>Create a new Sidebar</Button>
            </p>
          </div>
        </Card>
      </div>
      <h1>This is the manage sidebars screen</h1>
      <ul>{list}</ul>
      <Button isDestructive>Delete All Sidebars</Button>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ManageSidebars;
