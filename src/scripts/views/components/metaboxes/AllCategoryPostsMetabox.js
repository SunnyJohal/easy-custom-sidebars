/**
 * External dependancies
 */
import { useDebounce } from 'use-debounce';

/**
 * WordPress dependancies
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, PanelBody, PanelRow, __experimentalInputControl as InputControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { CheckboxControl, Spinner } from '@wordpress/components';

/**
 * Internal dependancies
 */
import { STORE_KEY } from '../../../store';
import sortItemsByName from '../../../utils/sortItemsByName';

const AllCategoryPostsMetabox = ({ attachments, setAttachments }) => {
  const taxonomies = useSelect(select => {
    return select(STORE_KEY).getTaxonomies();
  });

  if (!taxonomies || typeof taxonomies.category === 'undefined') {
    return null;
  }

  const { name, rest_base, slug } = taxonomies.category;

  return (
    <PanelBody title={__('All Posts In Category', 'easy-custom-sidebars')} initialOpen={false}>
      <CategoryPosts
        name={name}
        slug={slug}
        rest_base={rest_base}
        attachments={attachments}
        setAttachments={setAttachments}
      />
    </PanelBody>
  );
};

/**
 * Category Posts
 */
const CategoryPosts = props => {
  const { name, slug, rest_base } = props;
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm] = useDebounce(searchQuery, 200);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [paginationCursor, setPaginationCursor] = useState({ slug, rest_base, page: 1 });
  const prevPageCursor = { ...paginationCursor, page: paginationCursor.page - 1 };
  const nextPageCursor = { ...paginationCursor, page: paginationCursor.page + 1 };
  const totalPages = useSelect(select => select(STORE_KEY).getTaxonomyTerms(paginationCursor).totalPages) || 0;
  const initalReqMade = useSelect(select =>
    select(STORE_KEY).hasFinishedResolution('getTaxonomyTerms', [{ slug, rest_base, page: 1 }])
  );
  useEffect(() => setIsFetchingData(!initalReqMade), [initalReqMade]);

  const terms = useSelect(
    select => {
      const { itemsByPage } = select(STORE_KEY).getTaxonomyTerms(paginationCursor);
      const { page } = paginationCursor;

      // Perf: fetch next page in advance.
      select(STORE_KEY).getTaxonomyTerms(nextPageCursor);

      if (itemsByPage && itemsByPage[page]) {
        const items = itemsByPage[page];
        return sortItemsByName(items);
      }

      if (!itemsByPage && page === 1) {
        return [];
      }
    },
    [paginationCursor.page]
  );

  useEffect(() => {
    if (terms && terms.length > 0) {
      setItems(terms);
      setIsFetchingData(false);
    }
  }, [terms]);

  // Search.
  useEffect(() => {
    if (searchTerm) {
      setIsFetchingData(true);
      const path = addQueryArgs(`/wp/v2/${rest_base}`, {
        page: 1,
        per_page: 10,
        search: searchTerm
      });

      apiFetch({ path }).then(searchResults => {
        const results = searchResults.map(result => {
          return {
            id: result.id,
            name: result.name,
            label: name,
            link: result.link,
            data_type: slug,
            checked: false
          };
        });

        setSearchResults(results);
        setIsFetchingData(false);
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {/* Search Input and Loading Indicator. */}
      <div className="row align-items-end">
        <div className="col">
          <InputControl
            isFloatingLabel
            label={sprintf(__('Search %s', 'easy-custom-sidebars'), name)}
            value={searchQuery}
            onChange={(query = '') => {
              setSearchQuery(query);
            }}
          />
        </div>
        {isFetchingData && (
          <div className="col-auto pl-0 py-1">
            <Spinner className="m-0" />
          </div>
        )}
      </div>

      {/* Items || Search Results */}
      <PanelRow>
        {initalReqMade && items.length === 0 && (
          <div>
            <p>{sprintf(__('No %s have been created.', 'easy-custom-sidebars'), name)}</p>
          </div>
        )}

        {items.length > 0 && !searchQuery ? (
          <CategoryPostsAttachments items={items} setItems={setItems} />
        ) : (
          <>
            {searchTerm && !isFetchingData && searchResults.length === 0 && (
              <div>{sprintf(__('No results found for "%s"', 'easy-custom-sidebars'), searchTerm)}</div>
            )}
            <CategoryPostsAttachments items={searchResults} setItems={setSearchResults} />
          </>
        )}
      </PanelRow>

      {!searchQuery && (
        <CategoryPostsPagination
          page={paginationCursor.page}
          totalPages={totalPages}
          nextPage={() => setPaginationCursor(nextPageCursor)}
          prevPage={() => setPaginationCursor(prevPageCursor)}
        />
      )}

      {/* Add Attachments */}
      {!searchQuery && (
        <CategoryPostsActions
          items={items}
          setItems={setItems}
          addToSidebar={() => {
            const newAttachments = items
              .filter(item => item.checked)
              .map(item => {
                return {
                  id: item.id,
                  title: item.name,
                  label: __('All Posts In Category', 'easy-custom-sidebars'),
                  link: addQueryArgs(`${easy_custom_sidebars.admin_url}edit.php`, { taxonomy: slug }),
                  data_type: slug,
                  attachment_type: 'category_posts'
                };
              });

            props.setAttachments([...props.attachments, ...newAttachments]);
          }}
        />
      )}

      {/* Add Search Result Attachments */}
      {searchQuery && (
        <CategoryPostsActions
          items={searchResults}
          setItems={setSearchResults}
          addToSidebar={() => {
            const newAttachments = searchResults
              .filter(item => item.checked)
              .map(item => {
                return {
                  id: item.id,
                  title: item.name,
                  label: __('All Posts In Category', 'easy-custom-sidebars'),
                  link: addQueryArgs(`${easy_custom_sidebars.admin_url}edit.php`, { taxonomy: slug }),
                  data_type: slug,
                  attachment_type: 'category_posts'
                };
              });

            props.setAttachments([...props.attachments, ...newAttachments]);
          }}
        />
      )}
    </div>
  );
};

/**
 * Category Posts Attachments
 */
const CategoryPostsAttachments = ({ items, setItems }) => {
  if (!items.length) {
    return null;
  }

  return (
    <ul>
      {items.map(({ id, name, checked }, i) => {
        return (
          <li key={`${i}-${id}`}>
            <CheckboxControl
              label={name}
              checked={checked ? true : false}
              onChange={checked => {
                const updatedItems = [...items];
                updatedItems[i].checked = checked;
                setItems(updatedItems);
              }}
            />
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Posts Pagination Component
 */
const CategoryPostsPagination = ({ page, totalPages, nextPage, prevPage }) => {
  if (0 === totalPages) {
    return null;
  }

  return (
    <PanelRow className="mt-0 mb-3">
      {page > 1 && (
        <Button isTertiary onClick={prevPage}>
          {__('« Prev', 'easy-custom-sidebars')}
        </Button>
      )}

      <div className="ecs-metabox__pagination-indicator">
        {totalPages > 0 ? sprintf(__('Page %1s of %2s', 'easy-custom-sidebars'), page, totalPages) : null}
      </div>

      {page < totalPages && (
        <Button isTertiary onClick={nextPage}>
          {__('Next »', 'easy-custom-sidebars')}
        </Button>
      )}
    </PanelRow>
  );
};

/**
 * Posts Metabox Actions Component
 */
const CategoryPostsActions = props => {
  const { items, setItems, addToSidebar } = props;
  const noItemSelected = items.every(item => !item.checked);

  return (
    <PanelRow>
      <Button
        isLink
        onClick={() =>
          setItems(
            items.map(item => {
              item.checked = noItemSelected ? true : false;
              return item;
            })
          )
        }
      >
        {noItemSelected ? __('Select All', 'easy-custom-sidebars') : __('Clear Selection', 'easy-custom-sidebars')}
      </Button>
      <Button
        isSecondary
        onClick={() => {
          addToSidebar();
          setItems(
            items.map(item => {
              item.checked = false;
              return item;
            })
          );
        }}
      >
        {__('Add to Sidebar', 'easy-custom-sidebars')}
      </Button>
    </PanelRow>
  );
};

export default AllCategoryPostsMetabox;
