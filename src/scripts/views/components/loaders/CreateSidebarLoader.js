/**
 * External dependancies
 */
import Skeleton from 'react-loading-skeleton';

const CreateSidebarLoader = () => {
  return (
    <div>
      <div className="container-fluid p-0">
        <div className="row">
          {/* Sidebar selector placeholder */}
          <div className="col-12 mb-3">
            <Skeleton height={42} />
          </div>

          {/* Metabox placeholder */}
          <div className="col-12 col-md-5 col-xl-3 mb-4 mb-md-0">
            <Skeleton height={164} style={{ marginBottom: 1 }} />
            <Skeleton height={48} style={{ marginBottom: 0 }} />
            <Skeleton height={48} style={{ marginBottom: 0 }} />
            <Skeleton height={48} style={{ marginBottom: 0 }} />
          </div>

          {/* Sidebar settings placeholder */}
          <div className="col">
            <Skeleton height={68} style={{ marginBottom: 1 }} />
            <Skeleton height={420} style={{ marginBottom: 1 }} />
            <Skeleton height={68} style={{ marginBottom: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSidebarLoader;
