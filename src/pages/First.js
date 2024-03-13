import { Button } from "antd";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const dummyData = {
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      tasks: [
        { id: "task-1", content: "Task 1" },
        { id: "task-2", content: "Task 2" },
        // Add more tasks as needed
      ],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      tasks: [
        // Add tasks for 'In Progress' column if needed
      ],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      tasks: [
        // Add tasks for 'Done' column if needed
      ],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const First = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(dummyData);
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return; // Dragged outside of the droppable area
    }

    if (source.droppableId === destination.droppableId) {
      // Reorder tasks within the same column
      const column = data.columns[source.droppableId];
      const newTaskOrder = Array.from(column.tasks);
      newTaskOrder.splice(source.index, 1);
      newTaskOrder.splice(
        destination.index,
        0,
        data.columns[source.droppableId].tasks[source.index]
      );

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: {
            ...column,
            tasks: newTaskOrder,
          },
        },
      };

      setData(newData);
    } else {
      // Move task to a different column
      const sourceColumn = data.columns[source.droppableId];
      const destinationColumn = data.columns[destination.droppableId];

      const sourceTasks = Array.from(sourceColumn.tasks);
      const destinationTasks = Array.from(destinationColumn.tasks);

      const [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);

      const newData = {
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: {
            ...sourceColumn,
            tasks: sourceTasks,
          },
          [destination.droppableId]: {
            ...destinationColumn,
            tasks: destinationTasks,
          },
        },
      };

      setData(newData);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all items in local storage
    dispatch(logoutAction());
    navigate("/", { replace: true });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: "flex" }}
            >
              {data.columnOrder.map((columnId, index) => {
                const column = data.columns[columnId];
                return (
                  <Draggable
                    key={columnId}
                    draggableId={columnId}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ margin: "8px", minWidth: "200px" }}
                      >
                        <h2 {...provided.dragHandleProps}>{column.title}</h2>
                        <Droppable droppableId={columnId} type="task">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {column.tasks.map((task, index) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={task.id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        border: "1px solid lightgray",
                                        borderRadius: "4px",
                                        padding: "8px",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      {task.content}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button onClick={handleLogout}>LOGOUT</Button>
    </>
  );
};

export default First;
