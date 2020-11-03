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

const PostTypePosts = props => {
  const { name, slug, rest_base } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm] = useDebounce(searchQuery, 200);
  const [paginationCursor, setPaginationCursor] = useState({ slug, rest_base, page: 1 });
  const prevPageCursor = { ...paginationCursor, page: paginationCursor.page - 1 };
  const nextPageCursor = { ...paginationCursor, page: paginationCursor.page + 1 };
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const totalPages = useSelect(select => select(STORE_KEY).getPostTypePosts(paginationCursor).totalPages) || 0;

  const posts = useSelect(
    select => {
      const { itemsByPage } = select(STORE_KEY).getPostTypePosts(paginationCursor);
      const { page } = paginationCursor;

      // Perf: fetch next page in advance.
      select(STORE_KEY).getPostTypePosts(nextPageCursor);

      if (itemsByPage && itemsByPage[page]) {
        const items = itemsByPage[page];
        return Object.keys(items).map(id => items[id]);
      }

      if (!itemsByPage && page === 1) {
        return [];
      }
    },
    [paginationCursor.page]
  );

  useEffect(() => {
    const allItemsAttachment = {
      id: 0,
      title: { rendered: sprintf(__('All %s', 'easy-custom-sidebars'), name) },
      label: name,
      link: addQueryArgs(`${easy_custom_sidebars.admin_url}/edit.php`, { post_type: slug }),
      data_type: slug,
      attachment_type: 'post_type_all',
      checked: false
    };

    if (posts && posts.length > 0) {
      setItems([allItemsAttachment, ...posts]);
      setIsFetchingData(false);
    }
  }, [posts]);

  // Search test
  useEffect(() => {
    if (searchQuery) {
      setIsFetchingData(true);
      const path = addQueryArgs(`/wp/v2/search`, {
        page: 1,
        per_page: 12,
        search: searchQuery,
        subtype: slug
      });

      apiFetch({ path }).then(searchResults => {
        const results = searchResults.map(result => {
          setIsFetchingData(false);
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
      });
    }
  }, [searchTerm]);

  const results = items.map((item, i) => {
    return (
      <li key={item.id}>
        <CheckboxControl
          label={item.title.rendered}
          checked={item.checked ? true : false}
          onChange={checked => {
            const updatedItems = [...items];
            updatedItems[i].checked = checked;
            setItems(updatedItems);
          }}
        />
      </li>
    );
  });

  const attachmentsFound = searchResults.map((item, i) => {
    return (
      <li key={item.id}>
        <CheckboxControl
          label={item.title.rendered}
          checked={item.checked ? true : false}
          onChange={checked => {
            const updatedItems = [...searchResults];
            updatedItems[i].checked = checked;
            setSearchResults(updatedItems);
          }}
        />
      </li>
    );
  });

  return (
    <div>
      <div className="row align-items-end">
        <div className="col">
          <InputControl
            isFloatingLabel
            label={`Search ${name}`}
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

      {results.length > 0 && !searchQuery ? (
        <div>
          <ul>{results}</ul>
        </div>
      ) : (
        <PanelRow>
          <div>
            <ul>{attachmentsFound}</ul>
          </div>
        </PanelRow>
      )}

      {!searchQuery && (
        <PanelRow>
          {paginationCursor.page > 1 && (
            <Button isTertiary onClick={() => setPaginationCursor(prevPageCursor)}>
              {__('« Prev', 'easy-custom-sidebars')}
            </Button>
          )}

          {paginationCursor.page === 1 && <div></div>}

          {paginationCursor.page < totalPages && (
            <Button isTertiary onClick={() => setPaginationCursor(nextPageCursor)}>
              {__('Next »', 'easy-custom-sidebars')}
            </Button>
          )}
        </PanelRow>
      )}

      {/* Add Attachments */}
      {!searchQuery && (
        <PanelRow>
          {items.every(item => !item.checked) ? (
            <Button
              isLink
              onClick={() => {
                setItems(
                  items.map(item => {
                    item.checked = true;
                    return item;
                  })
                );
              }}
            >
              {__('Select All', 'easy-custom-sidebars')}
            </Button>
          ) : (
            <Button
              isLink
              onClick={() => {
                setItems(
                  items.map(item => {
                    item.checked = false;
                    return item;
                  })
                );
              }}
            >
              {__('Clear Selection', 'easy-custom-sidebars')}
            </Button>
          )}

          <Button
            isSecondary
            onClick={() => {
              const newAttachments = items
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
      )}

      {searchQuery && (
        <PanelRow>
          {searchResults.every(item => !item.checked) ? (
            <Button
              isLink
              onClick={() => {
                setSearchResults(
                  searchResults.map(item => {
                    item.checked = true;
                    return item;
                  })
                );
              }}
            >
              {__('Select All', 'easy-custom-sidebars')}
            </Button>
          ) : (
            <Button
              isLink
              onClick={() => {
                setSearchResults(
                  searchResults.map(item => {
                    item.checked = false;
                    return item;
                  })
                );
              }}
            >
              {__('Clear Selection', 'easy-custom-sidebars')}
            </Button>
          )}

          <Button
            isSecondary
            onClick={() => {
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

              setSearchResults(
                searchResults.map(item => {
                  item.checked = false;
                  return item;
                })
              );
            }}
          >
            {__('Add to Sidebar', 'easy-custom-sidebars')}
          </Button>
        </PanelRow>
      )}
    </div>
  );
};

const PostTypesMetabox = props => {
  const { attachments, setAttachments } = props;

  const posttypes = useSelect(select => select(STORE_KEY).getPostTypes());

  const publicPosttypes = Object.keys(posttypes).filter(
    posttype => !['attachment', 'sidebar_instance', 'wp_block'].includes(posttype)
  );

  const metaboxes = publicPosttypes.map((posttypeName, i) => {
    const isFirstItem = i === 0;
    const { name, rest_base, slug } = posttypes[posttypeName];

    return (
      <PanelBody title={name} key={slug} initialOpen={isFirstItem}>
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

export default PostTypesMetabox;
