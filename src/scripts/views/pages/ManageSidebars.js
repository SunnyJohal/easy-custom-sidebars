/**
 * External Dependancies
 */
import { Link, useHistory } from 'react-router-dom';

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
  let history = useHistory();

  const sidebars = useSelect(select => {
    return select(STORE_KEY).getSidebars();
  });

  const hasFinishedResolution = useSelect(select => {
    return select(STORE_KEY).hasFinishedResolution('getSidebars');
  });

  const { deleteSidebar } = useDispatch(STORE_KEY);

  const sidebarList = Object.keys(sidebars).map((id, index, arr) => {
    const isLastItem = index === arr.length - 1;
    return (
      <div key={id}>
        <div className="row">
          <div className="col-4">
            <h4 className="mt-0 mb-1">{sidebars[id].title.rendered}</h4>
            <div>
              <Link to={`${getScreenLink('edit', { sidebar: id })}`}>Edit</Link> |{' '}
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  deleteSidebar(id);
                }}
              >
                Delete
              </a>
            </div>
          </div>
          <div className="col">
            <select style={{ minWidth: 400 }}>
              <option value="">Test</option>
              <option value="">Test</option>
              <option value="">Test</option>
            </select>
          </div>
        </div>
        {isLastItem ? null : <CardDivider className="my-3" />}
      </div>
    );
  });

  return hasFinishedResolution ? (
    <div>
      {/* Admin UI Headers */}
      <Card className="mb-3">
        <CardBody className="d-block py-0 px-3">
          <div className="row">
            <div className="col">
              <p>
                Manage your sidebars here or{' '}
                <Button
                  isPrimary
                  className="ml-2"
                  onClick={() => {
                    history.push(getScreenLink('create'));
                  }}
                >
                  Create a new Sidebar
                </Button>
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* List of current sidebars. */}
      <Card>
        <CardHeader className="d-block px-3">
          <div className="row">
            <div className="col-4">Sidebar</div>
            <div className="col">Default Sidebar to Replace</div>
          </div>
        </CardHeader>
        <CardBody className="px-3">{sidebarList}</CardBody>
      </Card>

      <Button isDestructive>Delete All Sidebars</Button>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default ManageSidebars;
