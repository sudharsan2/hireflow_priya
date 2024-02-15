import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveTask,
  fetchTasksAsync,
  updateTaskAsync,
  fetchInterviewersAsync,
} from "../redux/slices/kanbanSlice";
import "../pages/kanban.css";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/slices/authSlice";
import { Button, Input, Modal, Select, Tooltip, Typography } from "antd";
import CardDetails from "../components/kanban/CardDetails";
import api from "../services/api";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { UpdatedDataTask } from "../redux/slices/interviewerSlice";

const { Option } = Select;

export default function Kanban() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.kanban.tasks);
  const interviewers = useSelector((state) => state.kanban.interviewers);
  const updatedTask = useSelector((state) => state.kanban.updatedData);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCardClick = async (cardData) => {
    try {
      const response = await api.get(
        `/hiring/entryLevel/getACandidate/${cardData.id}`
      );
      setSelectedCard(response.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    dispatch(fetchTasksAsync());
    dispatch(fetchInterviewersAsync());
  }, [dispatch, moveTask]);

  const handleDrop = (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      // Card was dropped outside of a droppable area or didn't change position
      return;
    }

    dispatch(
      moveTask({
        sourceColumn: source.droppableId,
        destinationColumn: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
    const updatedTask = tasks[source.droppableId][source.index];
    // Only dispatch the API call if the columns are different
    if (source.droppableId !== destination.droppableId) {
      dispatch(
        updateTaskAsync({ ...updatedTask, submissionStatus: "SUBMITTED" })
      );
    }
    // window.location.reload();
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleSave = async () => {
    try {
      // Dispatch the update action with the editedDetails and submissionStatus as 'SAVED'
      await dispatch(
        updateTaskAsync({ ...selectedCard, submissionStatus: "SAVED" })
      );
      console.log("Save clicked with data:", selectedCard);
      // Close the card details modal
      dispatch(UpdatedDataTask(selectedCard));

      // window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle the error as needed
    }
  };
  const handleLogout = () => {
    localStorage.clear(); // Clear all items in local storage
    dispatch(logoutAction());
    navigate("/", { replace: true });
  };

  return (
    <>
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
                  <h2>{column.toUpperCase()}</h2>
                  <ul>
                    {tasks[column].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                        isDragDisabled={task.submissionStatus !== "SAVED"}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleCardClick(task)}
                            style={{
                              ...provided.draggableProps.style,
                              cursor:
                                task.submissionStatus === "SAVED"
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                          >
                            <div className="card-header">
                              {" "}
                              <i
                                className="fas fa-user-circle"
                                style={{ marginRight: "5px" }}
                              ></i>
                              {task.name}
                            </div>
                            <div className="card-details">{task.jobRole}</div>
                            <div className="card-mark">
                              Score: {task.resumeScore}
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                  </ul>
                  {/* {provided.placeholder && (
                    <div
                      className="placeholder"
                      ref={provided.placeholder.innerRef}
                    />
                  )} */}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Modal
        title="Candidate Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          // <Button key="back" onClick={handleModalClose}>
          //   Close
          // </Button>,
        ]}
      >
        {selectedCard && (
          <div
            style={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Typography>Name: {selectedCard.name}</Typography>
            <Typography>Email: {selectedCard.email}</Typography>
            <Typography>Resume ID: {selectedCard.resumeId}</Typography>
            <Typography>
              Current Status: {selectedCard.currentStatus}
            </Typography>
            <Typography>Resume Score: {selectedCard.resumeScore}</Typography>
            <Tooltip title="Location">
              <Input
                placeholder="Location"
                value={selectedCard.location}
                onChange={(e) =>
                  setSelectedCard({ ...selectedCard, location: e.target.value })
                }
              />
            </Tooltip>
            <Tooltip title="Location">
              <Input
                placeholder="Qualification"
                value={selectedCard.qualification}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    qualification: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Candidate's Domain Experience">
              <Input
                placeholder="Domain"
                value={selectedCard.domainExperience}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    domainExperience: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Reason">
              <Input
                placeholder="Reason"
                value={selectedCard.reason}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    reason: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Travel">
              <Input
                placeholder="Travel"
                value={selectedCard.travelConstraint}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    travelConstraint: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Reference">
              <Input
                placeholder="Reference"
                value={selectedCard.referenceName}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    referenceName: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Reference Email">
              <Input
                placeholder="Reference Email"
                value={selectedCard.referenceEmail}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    referenceEmail: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Notification Period">
              <Input
                placeholder="Notification Period"
                value={selectedCard.notificationPeriod}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    notificationPeriod: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Father Occupation">
              <Input
                placeholder="Father Occupation"
                value={selectedCard.fatherOccupation}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    fatherOccupation: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Mother Occupation">
              <Input
                placeholder="Mother Occupation"
                value={selectedCard.motherOccupation}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    motherOccupation: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Shortlist Status">
              <Select
                placeholder="Shortlist Status"
                value={selectedCard.shortlistStatus}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    shortlistStatus: e.target.value,
                  })
                }
              >
                <Option value="SHORTLISTED">Shortlisted</Option>
                <Option value="NOTSHORTLISTED">Not Shortlisted</Option>
              </Select>
            </Tooltip>
            <Tooltip title="Interviewer">
              <Select
                placeholder="Interviewer"
                value={selectedCard.interviewer}
                onChange={(value) =>
                  setSelectedCard({
                    ...selectedCard,
                    interviewer: value,
                  })
                }
              >
                {interviewers.map((interviewer) => (
                  <Option key={interviewer.id} value={interviewer.empId}>
                    {interviewer.username}
                  </Option>
                ))}
              </Select>
            </Tooltip>
          </div>
        )}
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal>

      <Button onClick={handleLogout}>LOGOUT</Button>
    </>
  );
}
