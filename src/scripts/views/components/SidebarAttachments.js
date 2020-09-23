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

const getItems = (count, offset = 0) => {
  // This is where to fetch the list from.
  return Array.from({ length: count }, (v, k) => k).map(k => {
    return {
      id: `item-${k + offset}-${new Date().getTime()}`,
      content: `item ${k + offset}`
    };
  });
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

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
    maxWidth: 400
  };
};

const SidebarAttachments = props => {
  const [state, setState] = useState([getItems(10)]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // Dropped outside the list.
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter(group => group.length));
    }
  }

  return (
    <div className="ecs-sidebar-attachments">
      <button
        type="button"
        onClick={() => {
          setState([...state, []]);
        }}
      >
        Add new group
      </button>
      <button
        type="button"
        onClick={() => {
          setState([...state, getItems(1)]);
        }}
      >
        Add new item
      </button>
      <div className="ecs-sidebar-attachments__container d-flex">
        <DragDropContext className="ecs-sidebar-attachments__drag-drop-context" onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
            <Droppable className="ecs-sidebar-attachments__drag-drop-droppable" key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  className="ecs-sidebar-attachments__drag-drop-list"
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
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
                            <PanelBody title={item.content} initialOpen={false} icon="sort">
                              <PanelRow>
                                <Button
                                  isSecondary
                                  onClick={() => {
                                    const newState = [...state];
                                    newState[ind].splice(index, 1);
                                    setState(newState.filter(group => group.length));
                                  }}
                                >
                                  {__('Delete', 'easy-custom-sidebars')}
                                </Button>
                                Need to put the tab panel in herezzz
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
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default SidebarAttachments;
