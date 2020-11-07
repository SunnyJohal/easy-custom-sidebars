/**
 * External dependancies
 */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { Button, Panel, PanelBody, PanelRow } from '@wordpress/components';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (_, draggableStyle) => {
  return {
    userSelect: 'none',
    margin: `0 0 ${grid}px 0`,
    ...draggableStyle
  };
};

const getListStyle = isDraggingOver => {
  return {
    background: isDraggingOver ? '#fafafa' : '',
    padding: grid,
    width: '100%',
    maxWidth: 420,
    marginLeft: `-${grid}px`
  };
};

const SidebarAttachments = props => {
  const { attachments, setAttachments } = props;

  function reorderAttachments({ source, destination }) {
    // Dropped outside of list.
    if (!destination) {
      return;
    }

    setAttachments(reorder(attachments, source.index, destination.index));
  }
  console.log(attachments);

  return (
    <div className="ecs-sidebar-attachments">
      <div className="ecs-sidebar-attachments__container d-flex">
        {/* Flat list. */}
        <DragDropContext className="ecs-sidebar-attachments__drag-drop-context" onDragEnd={reorderAttachments}>
          <Droppable droppableId="ecs-sidebar-attachments">
            {(provided, snapshot) => (
              <div
                className="ecs-sidebar-attachments__drag-drop-list"
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {attachments.map((item, index) => (
                  <Draggable key={index} draggableId={`item-${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className="ecs-sidebar-attachments__drag-drop-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <Panel>
                          <PanelBody
                            title={`${item.title ? item.title : __('(No Title)')} (${item.label})`}
                            initialOpen={false}
                            icon="sort"
                          >
                            <PanelRow>
                              <Button isLink href={item.link} target="_blank">
                                {__('Visit Link', 'easy-custom-sidebars')}
                              </Button>
                              <Button
                                isDestructive
                                onClick={() => {
                                  const allAttachments = [...attachments];
                                  allAttachments.splice(index, 1);
                                  setAttachments(allAttachments);
                                }}
                              >
                                {__('Delete', 'easy-custom-sidebars')}
                              </Button>
                            </PanelRow>
                          </PanelBody>
                        </Panel>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      {attachments.length > 0 && (
        <Button className="mt-3" isDestructive onClick={() => setAttachments([])}>
          {__('Delete All Attachments', 'easy-custom-sidebars')}
        </Button>
      )}
    </div>
  );
};

export default SidebarAttachments;
