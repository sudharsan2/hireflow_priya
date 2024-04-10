/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveTask,
  fetchTasksAsync,
  updateTaskAsync,
  fetchInterviewersAsync,
  updateWaitingTaskAsync,
  fetchFinalDataAsync,
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
  message,
  notification,
} from "antd";
import CardDetails from "../components/kanban/CardDetails";
import api from "../services/api";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { UpdatedDataTask } from "../redux/slices/interviewerSlice";
import moment from "moment";
import Kanbannav from "../components/usermanagement/Kanbannav";
import WalkInCandidate from "./WalkinCandidate";
import Meeting from "../components/meet/Meet";
import { DownloadOutlined } from '@ant-design/icons';
import axios from "axios";

import Toolkit from "./multipleinterviewers";

const { Option } = Select;

export default function Kanban() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.kanban.tasks);
  const interviewers = useSelector((state) => state.kanban.interviewers);
  const updatedTask = useSelector((state) => state.kanban.updatedData);
  const [interviewers1, setinterviewers] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalWaitingVisible, setIsModalWaitingVisible] = useState(false);
  // Add a state variable to track save status
  const [isSaved, setIsSaved] = useState(false);
  const [isWalkinUpload, setIsWalkinUpload] = useState(false);
  const [newCandidate, setNewCandidate] = useState(false);
  const [isModalMeet, setIsModalMeet] = useState(false);
  const handleModalOpen = () => {
    setIsModalMeet(true);
  }
  const handleModalMeet = () => {
    setIsModalMeet(false);
  }

  const generateStars = (resumeScore) => {
    // Convert resumeScore to a number
    const score = parseInt(resumeScore);
  
    // Array to hold the stars JSX elements
    const stars = [];
  
    // Loop to create the stars based on the score
    for (let i = 0; i < score; i++) {
      stars.push(<span key={i} style={{ color: 'gold' }}>&#9733;</span>);
    }
  
    return stars;
  };

  const handleIsWalkinUpload = () => {
    console.log("yes it works");
    setIsWalkinUpload(true);
    setNewCandidate(false);
  }
  const handleNewCandidate = () => {
    setNewCandidate(false);
  }
  const handleNewCandidateBtn = () => {
    console.log('btn clicked')
    setNewCandidate(true);
  }
  const handleDownload = async () => {
    console.log(selectedCard.resumeId);
    const resumeId = selectedCard.resumeId;
    try {
      const response = await axios.get(`http://172.235.10.116:7000/hiring/auth/downloadResume/${resumeId}`, {
        responseType: 'blob',
      });
      console.log(response.headers);
      // const match = /filename="([^"]+)"/.exec(disposition);

      const disposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
      console.log(disposition);
      const match = /filename="([^"]+)"/.exec(disposition);
      console.log(match);
      const filename = match ? match[1] : `resume-${resumeId}.pdf`;

      const blob = new Blob([response.data], { type: 'application/pdf' });


      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);

      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('File not found!');
      console.error('Error downloading file:', error);
    }
  };

  const handleCardClick = async (cardData) => {
    try {
      if (cardData.currentStatus === "IN_TECH") {
        // If the card is in the "Waiting" column, open the modal with empty fields
        setIsModalVisible(false);
      } else if (cardData.currentStatus === "IN_FINAL") {
        // If the card is in the "Final" column, open the modal with specific fields
        setIsModalWaitingVisible(true);
        const response = await api.get(
          `/hiring/entryLevel/getACandidate/${cardData.id}`
        );
        setSelectedCard(response.data);
        // setinterviewers(selectedCard.interviewer.map(interviewerId => ({ interviewer: interviewerId })))
        // setSelectedCard(modalData);
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
    dispatch(fetchFinalDataAsync());
  }, [dispatch, moveTask, isSaved, isWalkinUpload]);

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


    setTimeout(() => {
      dispatch(fetchTasksAsync());
    }, 3000);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsModalWaitingVisible(false);
  };

  const validateFields = (fields) => {
    const errors = {};
    let requiredFields = [];
    // Check if any required fields are empty
    console.log(fields.shortlistStatus);
    if (fields.shortlistStatus == "SHORTLISTED") {
      requiredFields = [
        "location",
        "qualification",
        "domainExperience",

        // "travelConstraint",


        "notificationPeriod",
        "fatherOccupation",
        "motherOccupation",
        "shortlistStatus",
        "interviewer",
      ];
    }
    else {
      requiredFields = [
        "location",
        "qualification",
        "domainExperience",

        // "travelConstraint",


        "notificationPeriod",
        "fatherOccupation",
        "motherOccupation",
        "shortlistStatus",

      ];
    }


    requiredFields.forEach((field) => {
      if (!fields[field]) {
        errors[field] = `${field} is required.`;
      }
    });

    // Additional validation for domainExperience and notificationPeriod
    if (!/^\d+$/.test(fields.domainExperience)) {
      errors.domainExperience = "Domain Experience should be a valid integer.";
    }

    if (!/^\d+$/.test(fields.notificationPeriod)) {
      errors.notificationPeriod =
        "Notification Period should be a valid integer.";
    }

    if (fields.referenceEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.referenceEmail)) {
        errors.referenceEmail =
          "Reference Email should be in a valid email format.";
      }
    }


    return errors;
  };

  const handleSave = async () => {
    setSaveButtonLoading(true);

    try {

      const validationErrors = validateFields(selectedCard);
      // condition for waiting
      if (selectedCard.recruiterSubmissionStatus == 'SUBMITTED' && !selectedCard.joinDate) {
        notification.error({ message: 'joinDate is required' });
        return;
      }

      if ((selectedCard.recruiterSubmissionStatus == 'SAVED' || selectedCard.recruiterSubmissionStatus == null) && Object.keys(validationErrors).length > 0) {
        // Display error messages to the user
        Object.values(validationErrors).forEach((errorMsg) => {
          notification.error({ message: errorMsg });
        });
        return;
      }
      // Dispatch the update action with the editedDetails and submissionStatus as 'SAVED'
      await dispatch(
        updateTaskAsync({ ...selectedCard, recruiterSubmissionStatus: "SAVED" })
      );
      console.log("Save clicked with data:", selectedCard);
      // Close the card details modal
      dispatch(UpdatedDataTask(selectedCard));
      // dispatch(fetchTasksAsync());
      setIsSaved(true); // Set isSaved to true after saving
      // window.location.reload();
      // Close the modal
      dispatch(fetchTasksAsync());
      dispatch(fetchFinalDataAsync());
      setIsModalVisible(false);
      handleModalClose();

    } catch (error) {
      console.error("Error updating task:", error);
      // Handle the error as needed
    }
    finally {
      setSaveButtonLoading(false);
    }

  };

  const handleWaitSave = async () => {
    try {
      // Prepare the payload for the API call
      const apiPayload = {
        resumeId: selectedCard.resumeId, // Use the resumeId from the selectedCard
        longTermAssocaition: selectedCard.longTermAssocaition,
        joinDate: selectedCard.joinDate,
        specialRequest: selectedCard.specialRequest,
        hrFeedback: selectedCard.hrFeedback,
        shortlistStatus: selectedCard.shortlistStatus,
        remarks: selectedCard.remarks,
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
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);


  const avatarUrl = process.env.PUBLIC_URL + "./img/avtr3.jpg";
  return (
    <>
      <Kanbannav />
      <Button
        className="ncbtn"
        onClick={handleNewCandidateBtn}
      >
        Walkin
      </Button>
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
                              {/* <img
                                className="avatarkan"
                                src={avatarUrl}
                                alt="User Avatar"
                              /> */}

                              <div>
                                <h3>{task.name}</h3>
                                <p>Phone:{task.phoneNo}</p>
                                {/* <p>Mail:{task.email}</p> */}
                                <p>Job Role: {task.jobRole}</p>
                                <p>Experience: {task.yearsOfExperience}</p>
                                <p>Score : {generateStars(task.resumeScore)}</p>
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
        open={newCandidate}
        onCancel={handleNewCandidate}
        width={540}
        footer={
          [
          ]
        }
      >
        <WalkInCandidate isWalkinUpload={handleIsWalkinUpload} />
      </Modal>

      <Modal
        title="Candidate Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        width={570}
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
            {/* <Typography>Name: {selectedCard.name}</Typography> */}
            {/* <Typography>Email: {selectedCard.email}</Typography> */}
            <Typography>Resume ID: {selectedCard.resumeId}</Typography>
            <Typography>Resume Score: {selectedCard.resumeScore}</Typography>
            <Typography>Current Status: {selectedCard.currentStatus}</Typography>
            <Tooltip title="Name">
              <Input
                placeholder="Name"
                value={selectedCard.name}
                onChange={(e) =>
                  setSelectedCard({ ...selectedCard, name: e.target.value })
                }
              />
            </Tooltip>
            <Tooltip title="Email">
              <Input
                placeholder="Email"
                value={selectedCard.email}
                onChange={(e) =>
                  setSelectedCard({ ...selectedCard, email: e.target.value })
                }
              />
            </Tooltip>



            <Tooltip title="Location">
              <Input
                placeholder="Location"
                value={selectedCard.location}
                onChange={(e) =>
                  setSelectedCard({ ...selectedCard, location: e.target.value })
                }
              />

            </Tooltip>
            <Tooltip title="Job Role">
              <Select
                placeholder="Job Role"
                value={selectedCard.jobRole}
                onChange={(value) =>
                  setSelectedCard({
                    ...selectedCard,
                    jobRole: value,
                  })
                }
              >
                <Option value="Oracle Apps Technical Consultant">Oracle Apps Technical Consultant</Option>
                <Option value="Java Full Stack developer">Java Full Stack developer</Option>
                <Option value="Oracle Apps DBA">Oracle Apps DBA</Option>
                <Option value="Oracle Finance Functional Consultant">Oracle Finance Functional Consultant</Option>
                <Option value="Oracle HRMS consultant">Oracle HRMS consultant</Option>
                <Option value="Oracle SCM consultant">Oracle SCM consultant</Option>
                <Option value="Fresher">Fresher</Option>
              </Select>
            </Tooltip>

            <Tooltip title="Qualification">
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
                placeholder="Candidate's Domain Experience"
                value={selectedCard.domainExperience}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    domainExperience: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="phoneNo">
              <Input
                placeholder="phoneNo"
                value={selectedCard.phoneNo}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    phoneNo: e.target.value,
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
                onChange={(value) =>
                  setSelectedCard({
                    ...selectedCard,
                    shortlistStatus: value,
                  })
                }
              >
                <Option value="SHORTLISTED">Shortlisted</Option>
                <Option value="NOTSHORTLISTED">Not Shortlisted</Option>
              </Select>
            </Tooltip>
            {selectedCard.shortlistStatus === "NOTSHORTLISTED" ? null :
             <>
              {/* <Tooltip title="Interviewer">
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
            </Tooltip> */}
            <Toolkit interviewerList={interviewers} selectedcard={selectedCard} handleclick = {handleModalOpen} interviewers1 = {interviewers1} />
            {console.log(selectedCard)}
            </>
            }


          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          {selectedCard && selectedCard.currentStatus == "ASSIGNED" && <Button key="save" type="primary" onClick={handleSave} loading={saveButtonLoading}>
            Save
          </Button>}
          {/* {selectedCard && !selectedCard.interviewer ? null :
            selectedCard && selectedCard.currentStatus == "ASSIGNED" &&
            <Button
              key="meet"
              type="primary"
              onClick={handleModalOpen}
              style={{ marginLeft: '10px' }}
            >
              Meet
            </Button>
          } */}
          <div style={{ marginLeft: 'auto' }}>
            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} />
          </div>
        </div>

        <Modal
          open={isModalMeet}
          onCancel={handleModalMeet}
          width={530}
          footer={
            [
            ]
          }
        >
          <Meeting onSave={handleModalMeet} prevData={selectedCard} />
        </Modal>
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
            <Tooltip title="ResumeId">
              <Input
                placeholder="ResumeId"
                value={selectedCard.resumeId}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    resumeId: e.target.value,
                  })
                }
              />
            </Tooltip>

            <Tooltip title="LongTermAssocaition">
              <Input
                placeholder="LongTermAssocaition"
                value={selectedCard.longTermAssocaition}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    longTermAssocaition: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="JoinDate">

              <input
                type="date"
                placeholder="Join Date"
                value={selectedCard.joinDate}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    joinDate: e.target.value,
                  })
                }
              />
            </Tooltip>

            <Tooltip title="SpecialRequest">
              <Input
                placeholder="SpecialRequest"
                value={selectedCard.specialRequest}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    specialRequest: e.target.value,
                  })
                }
              />
            </Tooltip>
            <Tooltip title="HrFeedback">
              <Input
                placeholder="HrFeedback"
                value={selectedCard.hrFeedback}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    hrFeedback: e.target.value,
                  })
                }
              />
            </Tooltip>
            {/* <Tooltip title="ShortlistStatus">
              <Input
                placeholder="ShortlistStatus"
                value={selectedCard.shortlistStatus}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    shortlistStatus: e.target.value,
                  })
                }
              />
            </Tooltip> */}
            <Tooltip title="Remarks">
              <Input
                placeholder="Remarks"
                value={selectedCard.remarks}
                onChange={(e) =>
                  setSelectedCard({
                    ...selectedCard,
                    remarks: e.target.value,
                  })
                }
              />
            </Tooltip>
          </div>
        )}
        <Button
          key="save" type="primary"
          onClick={handleSave}
          loading={saveButtonLoading}
          style={{ marginTop: '10px' }}
        >
          Save
        </Button>
      </Modal>
    </>
  );
}
