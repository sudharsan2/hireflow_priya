// KanbanBoard.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveTask,
  fetchTasksAsync,
  updateTaskAsync,
} from "../redux/slices/kanbanSlice";
import { logoutAction } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import CardDetails from "../components/kanban/CardDetails";
import api from "../services/api";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./kanban.css"; // Make sure to include your styles here
import Kanbannav from "../components/usermanagement/Kanbannav";

const Kanban = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.kanban.tasks);

  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = async (cardData) => {
    try {
      // Make API call to get detailed information for the selected card
      const response = await api.get(
        `/hiring/entryLevel/getACandidate/${cardData.id}`
      );
      setSelectedCard(response.data);
    } catch (error) {
      console.error("Error fetching card details:", error);
      // Handle error appropriately
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    dispatch(fetchTasksAsync());
  }, [dispatch]);

  const handleDrop = (result) => {
    const { source, destination } = result;

    if (!destination) return; // Card was dropped outside of a droppable area

    dispatch(
      moveTask({
        sourceColumn: source.droppableId,
        destinationColumn: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
    // Update the currentStatus property in selectedCard
    setSelectedCard((prevSelectedCard) => ({
      ...prevSelectedCard,
      currentStatus:
        destination.droppableId === "Tech" ? "IN TECH" : "Some Other Status",
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all items in local storage
    dispatch(logoutAction());
    navigate("/", { replace: true });
  };

  const avatarUrl = process.env.PUBLIC_URL + "./img/avtr3.jpg"

  return (
    <>
    <Kanbannav />
      <DragDropContext onDragEnd={handleDrop}>
        <div className="kanban-board">
          {Object.keys(tasks).map((column) => (
            <Droppable key={column} droppableId={column}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="column"
                >
                  <h2 style={{ backgroundColor: "rgb(219, 247, 255)", padding: "20px", borderTop: "3px solid #0091ff", borderRadius: "10px", color:"rgb(62, 62, 62)", fontSize: "1.2em", }}>{column}</h2>
                  <ul>
                    {tasks[column].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleCardClick(task)}
                            style={{
                              ...provided.draggableProps.style,
                              cursor: "pointer",
                            }}
                          >
                            
                            <div>
                            
                              <h2 >{task.name}</h2>
                              <img className="avatarkan" src={avatarUrl} alt="User Avatar" />
                              <p>Job Role: {task.jobRole}</p>
                              <p c>Experience: {task.yearsOfExperience}</p>
                              <p className="score">{task.resumeScore}</p>
                              
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  </ul>
                  {/* {provided.placeholder} */}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selectedCard && (
        <CardDetails
          cardData={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      <Button onClick={handleLogout}>LOGOUT</Button>
    </>
  );
};

export default Kanban;
