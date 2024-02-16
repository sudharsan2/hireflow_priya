/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveTask,
  fetchTasksAsync,
  updateTaskAsync,
  fetchInterviewersAsync,
  updateWaitingTaskAsync,
} from "../redux/slices/kanbanSlice";
import "../pages/kanban.css";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/slices/authSlice";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Tooltip,
  Typography,
} from "antd";
import CardDetails from "../components/kanban/CardDetails";
import api from "../services/api";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { UpdatedDataTask } from "../redux/slices/interviewerSlice";
import moment from "moment";
import Kanbannav from "../components/usermanagement/Kanbannav";

const { Option } = Select;

export default function Kanban() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.kanban.tasks);
  const interviewers = useSelector((state) => state.kanban.interviewers);
  const updatedTask = useSelector((state) => state.kanban.updatedData);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalWaitingVisible, setIsModalWaitingVisible] = useState(false);
  // Add a state variable to track save status
  const [isSaved, setIsSaved] = useState(false);
  const [waitingValues, setWaitingValues] = useState({
    longTermAssocaition: "",
    joinDate: "",
    specialRequest: "",
    hrFeedback: "",
    shortlistStatus: "",
    remarks: "",
  });

  const handleCardClick = async (cardData) => {
    try {
      if (cardData.currentStatus === "IN_TECH") {
        // If the card is in the "Waiting" column, open the modal with empty fields
        setIsModalVisible(false);
      } else if (cardData.currentStatus === "IN_FINAL") {
        // If the card is in the "Final" column, open the modal with specific fields
        const response = await api.get(
          `/hiring/entryLevel/getACandidate/${cardData.id}`
        );
        setSelectedCard(response.data);
        // setSelectedCard(modalData);
        setIsModalWaitingVisible(true);
      } else {
        // If the card is in other columns, fetch the card details from the API
        const response = await api.get(
          `/hiring/entryLevel/getACandidate/${cardData.id}`
        );
        setSelectedCard(response.data);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    dispatch(fetchTasksAsync());
    dispatch(fetchInterviewersAsync());
  }, [dispatch, moveTask, isSaved]);

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

    // Check if the source column is "Assigned" and the destination column is "Waiting" or "Selected"
    if (
      source.droppableId === "Assigned" &&
      (destination.droppableId === "Waiting" ||
        destination.droppableId === "Selected")
    ) {
      // Prevent the drop action for cards from the "Assigned" column to "Waiting" or "Selected"
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
        updateTaskAsync({
          ...updatedTask,
          recruiterSubmissionStatus: "SUBMITTED",
        })
      );
    }
    // window.location.reload();
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsModalWaitingVisible(false);
  };

  const handleSave = async () => {
    try {
      // Dispatch the update action with the editedDetails and submissionStatus as 'SAVED'
      await dispatch(
        updateTaskAsync({ ...selectedCard, recruiterSubmissionStatus: "SAVED" })
      );
      console.log("Save clicked with data:", selectedCard);
      // Close the card details modal
      dispatch(UpdatedDataTask(selectedCard));
      setIsSaved(true); // Set isSaved to true after saving
      // window.location.reload();
      // Close the modal
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle the error as needed
    }
  };

  const handleWaitSave = async () => {
    try {
      // Prepare the payload for the API call
      const apiPayload = {
        resumeId: selectedCard.resumeId, // Use the resumeId from the selectedCard
        longTermAssocaition: waitingValues.longTermAssocaition,
        joinDate: waitingValues.joinDate,
        specialRequest: waitingValues.specialRequest,
        hrFeedback: waitingValues.hrFeedback,
        shortlistStatus: waitingValues.shortlistStatus,
        remarks: waitingValues.remarks,
        submissionStatus: "SAVED",
      };

      // Dispatch the updateWaitingTaskAsync action with the payload
      await dispatch(updateWaitingTaskAsync(apiPayload));

      console.log("Save clicked with data:", selectedCard);
      dispatch(UpdatedDataTask(selectedCard));
      setIsSaved(true);
      setIsModalWaitingVisible(false); // Close the second modal
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

  const avatarUrl = process.env.PUBLIC_URL + "./img/avtr3.jpg";
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
                  <h2
                    style={{
                      backgroundColor: "rgb(219, 247, 255)",
                      padding: "20px",
                      borderTop: "3px solid #0091ff",
                      borderRadius: "10px",
                      color: "rgb(62, 62, 62)",
                      fontSize: "1.2em",
                    }}
                  >
                    {column}
                  </h2>
                  <ul>
                    {tasks[column].map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                        isDragDisabled={
                          task.recruiterSubmissionStatus !== "SAVED"
                        }
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
                                task.recruiterSubmissionStatus === "SAVED"
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                          >
                            <div style={{ position: "relative" }}>
                              <img
                                className="avatarkan"
                                src={avatarUrl}
                                alt="User Avatar"
                              />

                              <div>
                                <h2>{task.name}</h2>
                                <p>Job Role: {task.jobRole}</p>
                                <p>Experience: {task.yearsOfExperience}</p>
                                <p className="score">{task.resumeScore}</p>
                              </div>
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
        footer={
          [
            // <Button key="back" onClick={handleModalClose}>
            //   Close
            // </Button>,
          ]
        }
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

      <Modal
        title="Candidate Details"
        open={isModalWaitingVisible}
        onCancel={handleModalClose}
        footer={
          [
            // <Button key="back" onClick={handleModalClose}>
            //   Close
            // </Button>,
          ]
        }
      >
        {" "}
        {selectedCard && (
          <div
            style={{
              display: "grid",
              gap: "10px",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Typography>Name: {selectedCard.resumeId}</Typography>

            <Tooltip title="LongTermAssocaition">
              <Input
                placeholder="LongTermAssocaition"
                value={waitingValues.longTermAssocaition}
                onChange={(e) =>
                  setWaitingValues({
                    ...waitingValues,
                    longTermAssocaition: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="JoinDate">
              <DatePicker
                placeholder="JoinDate"
                format="YYYY-MM-DD"
                value={
                  waitingValues.joinDate
                    ? moment(waitingValues.joinDate, "YYYY-MM-DD")
                    : null
                }
                onChange={(date, dateString) =>
                  setWaitingValues({
                    ...waitingValues,
                    joinDate: dateString,
                  })
                }
              />
            </Tooltip>

            <Tooltip title="SpecialRequest">
              <Input
                placeholder="SpecialRequest"
                value={waitingValues.specialRequest}
                onChange={(e) =>
                  setWaitingValues({
                    ...waitingValues,
                    specialRequest: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="HrFeedback">
              <Input
                placeholder="HrFeedback"
                value={waitingValues.hrFeedback}
                onChange={(e) =>
                  setWaitingValues({
                    ...waitingValues,
                    hrFeedback: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="ShortlistStatus">
              <Input
                placeholder="ShortlistStatus"
                value={waitingValues.shortlistStatus}
                onChange={(e) =>
                  setWaitingValues({
                    ...waitingValues,
                    shortlistStatus: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Remarks">
              <Input
                placeholder="Remarks"
                value={waitingValues.remarks}
                onChange={(e) =>
                  setWaitingValues({
                    ...waitingValues,
                    remarks: e.target.value,
                  })
                }
              />
            </Tooltip>
          </div>
        )}
        <Button key="save" type="primary" onClick={handleWaitSave}>
          Save
        </Button>
      </Modal>

    
    </>
  );
}