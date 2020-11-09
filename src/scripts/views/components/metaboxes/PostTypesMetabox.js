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
import sortItemsByTitle from '../../../utils/sortItemsByTitle';

/**
 * All Posttypes Metabox
 */
const PostTypesMetabox = ({ attachments, setAttachments, openMetabox, setOpenMetabox }) => {
  const posttypes = useSelect(select => select(STORE_KEY).getPostTypes());

  const publicPosttypes = Object.keys(posttypes).filter(
    posttype => !['attachment', 'sidebar_instance', 'wp_block'].includes(posttype)
  );

  const metaboxes = publicPosttypes.map((posttypeName, i) => {
    const isFirstItem = i === 0;
    const { name, rest_base, slug } = posttypes[posttypeName];
    const panelId = `ecs-metabox-posttype-${slug}`;
    const isActive = panelId === openMetabox;
    return (
      <PanelBody
        title={name}
        key={slug}
        initialOpen={isFirstItem}
        opened={isActive}
        onToggle={() => {
          if (isActive) {
            setOpenMetabox(false);
          } else {
            setOpenMetabox(panelId);
          }
        }}
      >
        <PostTypePosts
          name={name}
          slug={slug}
          rest_base={rest_base}
          attachments={attachments}
          setAttachments={setAttachments}
        />
      </PanelBody>
    );
  });

  return metaboxes;
};

/**
 * Posttype Posts
 */
const PostTypePosts = props => {
  const { name, slug, rest_base } = props;
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm] = useDebounce(searchQuery, 200);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [paginationCursor, setPaginationCursor] = useState({ slug, rest_base, page: 1 });
  const prevPageCursor = { ...paginationCursor, page: paginationCursor.page - 1 };
  const nextPageCursor = { ...paginationCursor, page: paginationCursor.page + 1 };
  const totalPages = useSelect(select => select(STORE_KEY).getPostTypePosts(paginationCursor).totalPages) || 0;
  const initalReqMade = useSelect(select =>
    select(STORE_KEY).hasFinishedResolution('getPostTypePosts', [{ slug, rest_base, page: 1 }])
  );

  useEffect(() => setIsFetchingData(!initalReqMade), [initalReqMade]);

  const posts = useSelect(
    select => {
      const { itemsByPage } = select(STORE_KEY).getPostTypePosts(paginationCursor);
      const { page } = paginationCursor;

      // Perf: fetch next page in advance.
      select(STORE_KEY).getPostTypePosts(nextPageCursor);

      if (itemsByPage && itemsByPage[page]) {
        const items = itemsByPage[page];
        return sortItemsByTitle(items);
      }

      if (!itemsByPage && page === 1) {
        return [];
      }
    },
    [paginationCursor.page]
  );

  useEffect(() => {
    const allItemsAttachment = [
      {
        id: 0,
        title: { rendered: sprintf(__('All %s', 'easy-custom-sidebars'), name) },
        label: name,
        link: addQueryArgs(`${easy_custom_sidebars.admin_url}edit.php`, { post_type: slug }),
        data_type: slug,
        attachment_type: 'post_type_all',
        checked: false
      }
    ];

    if (slug !== 'post') {
      allItemsAttachment.push({
        id: 0,
        title: { rendered: sprintf(__('%s Archive', 'easy-custom-sidebars'), name) },
        label: name,
        link: addQueryArgs(`${easy_custom_sidebars.admin_url}edit.php`, { post_type: slug }),
        data_type: slug,
        attachment_type: 'post_type_archive',
        checked: false
      });
    }

    if (posts && posts.length > 0) {
      setItems([...allItemsAttachment, ...posts]);
      setIsFetchingData(false);
    }
  }, [posts]);

  // Search.
  useEffect(() => {
    if (searchTerm) {
      setIsFetchingData(true);
      const path = addQueryArgs(`/wp/v2/search`, {
        page: 1,
        per_page: 10,
        search: searchTerm,
        subtype: slug
      });

      apiFetch({ path }).then(searchResults => {
        const results = searchResults.map(result => {
          return {
            id: result.id,
            title: { rendered: result.title },
            label: name,
            link: result.url,
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
          <PostTypeAttachments items={items} setItems={setItems} />
        ) : (
          <>
            {searchTerm && !isFetchingData && searchResults.length === 0 && (
              <div>
                <p>{sprintf(__('No results found for "%s"', 'easy-custom-sidebars'), searchTerm)}</p>
              </div>
            )}
            <PostTypeAttachments items={searchResults} setItems={setSearchResults} />
          </>
        )}
      </PanelRow>

      {!searchQuery && (
        <PostsTypesPagination
          page={paginationCursor.page}
          totalPages={totalPages}
          nextPage={() => setPaginationCursor(nextPageCursor)}
          prevPage={() => setPaginationCursor(prevPageCursor)}
        />
      )}

      {/* Add Attachments */}
      {!searchQuery && (
        <PostTypesActions
          items={items}
          setItems={setItems}
          addToSidebar={() => {
            const newAttachments = items
              .filter(item => item.checked)
              .map(item => {
                return {
                  id: item.id,
                  title: item.title.rendered,
                  label: name,
                  link: item.link,
                  data_type: slug,
                  attachment_type: item.attachment_type || 'post_type'
                };
              });

            props.setAttachments([...props.attachments, ...newAttachments]);
          }}
        />
      )}

      {/* Add Search Result Attachments */}
      {searchQuery && (
        <PostTypesActions
          items={searchResults}
          setItems={setSearchResults}
          addToSidebar={() => {
            const newAttachments = searchResults
              .filter(item => item.checked)
              .map(item => {
                return {
                  id: item.id,
                  title: item.title.rendered,
                  label: name,
                  link: item.link,
                  data_type: slug,
                  attachment_type: 'post_type'
                };
              });

            props.setAttachments([...props.attachments, ...newAttachments]);
          }}
        />
      )}
    </div>
  );
};

const PostTypeAttachments = ({ items, setItems }) => {
  if (!items.length) {
    return null;
  }

  return (
    <ul>
      {items.map(({ id, title, checked }, i) => {
        return (
          <li key={`${i}-${id}`}>
            <CheckboxControl
              label={title.rendered}
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
const PostsTypesPagination = ({ page, totalPages, nextPage, prevPage }) => {
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
const PostTypesActions = props => {
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

export default PostTypesMetabox;
