import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Rankings.css";
import "../App.css";

function DraggableRankingEntry(props) {
  const getItemStyle = (isDragging, draggableStyle) => ({
    // change background colour if dragging
    background: isDragging ? "grey" : "transparent",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  return (
    <div key={props.anime} className="drag-item-container">
      <Draggable
        key={props.index}
        draggableId={props.index.toString()}
        index={props.index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
            className="drag-item"
          >
            <div className={`ranking-entry${props.index < 3 ? "-red" : ""}`}>
              <div className={`ranking-entry-num`}><b>{props.index + 1}</b></div>
              <div className="ranking-entry-name">{props.anime}</div>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  );
}

export default function Rankings(props) {
  return (
    <div id="rankings">
      <DragDropContext onDragEnd={props.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="drag-list"
            >
              {props.rankings.map((anime, index) => (
                <DraggableRankingEntry anime={anime} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
