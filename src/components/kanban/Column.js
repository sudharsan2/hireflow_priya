// Column.js
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from './Task'

const Column = ({ columnId, columnTitle, tasks, handleCardClick }) => {
  return (
    <Droppable droppableId={columnId} key={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="column"
        >
          <h2 className="colh2">{columnTitle.toUpperCase()}</h2>
          <ul>
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                handleCardClick={handleCardClick}
              />
            ))}
          </ul>
        </div>
      )}
    </Droppable>
  );
};

export default Column;
