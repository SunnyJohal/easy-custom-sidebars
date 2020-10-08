/**
 * External dependancies
 */
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Button, Panel, PanelBody, PanelRow } from '@wordpress/components';

const getAttachments = (count, offset = 0) => {
  return Array.from({ length: count }, (v, k) => k).map(k => {
    return {
      id: `item-${k + offset}-${new Date().getTime()}`,
      content: `item ${k + offset}`,
      example: 'This can be anything'
    };
  });
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => {
  // Some basic styles to make the items look a bit nicer.
  return {
    userSelect: 'none',
    // padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // Change background color if dragging.
    background: isDragging ? 'lightgreen' : '',

    // Styles we need to apply on draggables.
    ...draggableStyle
  };
};

const getListStyle = isDraggingOver => {
  return {
    background: isDraggingOver ? '#fafafa' : '',
    // padding: grid,
    width: '100%',
    maxWidth: 420
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

  return (
    <div className="ecs-sidebar-attachments">
      <Button
        className="mb-2"
        isPrimary
        onClick={() => {
          setAttachments([...attachments, ...getAttachments(1, attachments.length)]);
        }}
      >
        Add New Item
      </Button>
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
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className="ecs-sidebar-attachments__drag-drop-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <Panel>
                          <PanelBody title={`${item.content} (Type)`} initialOpen={false} icon="sort">
                            <PanelRow>
                              <Button
                                isLink
                                onClick={() => {
                                  const allAttachments = [...attachments];
                                  allAttachments.splice(index, 1);
                                  setAttachments(allAttachments);
                                }}
                              >
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
