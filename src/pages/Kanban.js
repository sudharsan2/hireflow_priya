
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
  Row,
  Col,
  Card
  
} from "antd";
import CardDetails from "../components/kanban/CardDetails";
import api from "../services/api";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { UpdatedDataTask } from "../redux/slices/interviewerSlice";
import moment from "moment";
import Kanbannav from "../components/usermanagement/Kanbannav";
import WalkInCandidate from "./WalkinCandidate";
import Meeting from "../components/meet/Meet";
import { DownloadOutlined, MessageOutlined, PhoneFilled, PhoneTwoTone } from '@ant-design/icons';
import axios from "axios";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import Toolkit from "./multipleinterviewers";
import ChatButton from "./chatbutton";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import DirectionsWalkSharpIcon from '@mui/icons-material/DirectionsWalkSharp';

const { Option } = Select;
const { Text, Title } = Typography;
const { TextArea } = Input;

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
  const [tracker, setTracker] = useState([]);
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = tracker;

  

  const handleChatButton = () => {
    navigate('/chat-msg');

  }
  const handleModalOpen = () => {
    setIsModalMeet(true);
  }
  const handleModalMeet = () => {
    setIsModalMeet(false);
  }


  // Get navigate function
  const handleCompanyChange = (index, field, value) => {
    const updatedCompanyHistory = [...selectedCard.candidateHistory];
    updatedCompanyHistory[index][field] = value;
    console.log({'history':updatedCompanyHistory})
    setSelectedCard({ ...selectedCard, candidateHistory: updatedCompanyHistory });
  };

  const handleChat = (param1Value) => {
    // Navigate to the '/chat-msg' route when chat button is clicked

    navigate('/chat-msg', { state: { param1Value } });
  };

  // const ChatButton = ({ onClick, ...rest }) => (
  //   <Button
  //     type="primary"
  //     icon={<MessageOutlined />}
  //     onClick={onClick}
  //     {...rest}
  //   >
  //     Chat
  //   </Button>
  // );
  const getStatusColor = (status) => {
    switch (status) {
      case "NOTSHORTLISTED":
        return "red"; // Set color to red for NOTSHORTLISTED status
      default:
        return "inherit"; // Inherit color for other statuses
    }
  };

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
      const response = await axios.get(`https://hireflowapidev.focusrtech.com:90/hiring/auth/downloadResume/${resumeId}`, {
        responseType: 'blob',
      });
      console.log(response.headers);
      // const match = /filename="([^"]+)"/.exec(disposition);
   
      const blob = new Blob([response.data], { type: 'application/pdf' });
   
      const url = window.URL.createObjectURL(blob);
   
      window.open(url, '_blank'); // Open PDF in a new tab/window
   
      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('File not found!');
      console.error('Error downloading file:', error);
    }
  };
  // const handleCardClick = async (cardData) => {
  //   try {
  //     if (cardData.currentStatus === "IN_TECH") {
  //       // If the card is in the "Waiting" column, open the modal with empty fields
  //       setIsModalVisible(true);
  //     } else if (cardData.currentStatus === "IN_FINAL") {
  //       // If the card is in the "Final" column, open the modal with specific fields
  //       setIsModalWaitingVisible(true);
  //       const response = await api.get(
  //         `/hiring/entryLevel/getACandidate/${cardData.id}`
  //       );
  //       setSelectedCard(response.data);
  //       // setinterviewers(selectedCard.interviewer.map(interviewerId => ({ interviewer: interviewerId })))
  //       // setSelectedCard(modalData);
  //     } else {
  //       // If the card is in other columns, fetch the card details from the API
  //       const response = await api.get(
  //         `/hiring/entryLevel/getACandidate/${cardData.id}`
  //       );
  //       setSelectedCard(response.data);
  //       setIsModalVisible(true);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching card details:", error);
  //   }
  // };

  const handleCardClick = async (cardData) => {
    try {
      let response;
      if (cardData.currentStatus === "IN_TECH") {
        setIsModalTechVisible(true);
        // Fetch the data for the selected card
        response = await api.get(
          `/hiring/entryLevel/getACandidate/${cardData.id}`
        );
        setSelectedCard(response.data);
      } else if (cardData.currentStatus === "IN_FINAL") {
        setIsModalWaitingVisible(true);
        response = await api.get(
          `/hiring/entryLevel/getACandidate/${cardData.id}`
        );
        setSelectedCard(response.data);
      } else {
        response = await api.get(
          `/hiring/entryLevel/getACandidate/${cardData.id}`
        );
        setSelectedCard(response.data);
        setIsModalVisible(true);
      }

      // Check if response contains the 'interviewer' array and set it to state
      if (response && response.data && response.data.tracker) {
        setTracker(response.data.tracker);
      } else {
        // Set interviewers to null or an empty array if no data is found
        setTracker([]);
      }
    } catch (error) {
      console.error("Error fetching card details:", error);
    }
  };

  console.log("track", tracker);

  const [isModalTechVisible, setIsModalTechVisible] = useState(false);

  const handleModalTechClose = () => {
    setIsModalTechVisible(false);
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
      (destination.droppableId === "Processed" ||
        destination.droppableId === "Completed")
    ) {
      // Prevent the drop action for cards from the "Assigned" column to "Waiting" or "Selected"
      return;
    }
    if (source.droppableId === "Tech" && (destination.droppableId == "Completed" || destination.droppableId == "Assigned")) {
      console.log(tasks);
      return;
    }
    if (source.droppableId === "Processed" && (destination.droppableId == "Tech" || destination.droppableId == "Assigned")) {
      return;
    }
    if (source.droppableId === "Completed" && (destination.droppableId == "Processed" || destination.droppableId == "Tech" || destination.droppableId == "Assigned")) {
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

      dispatch(fetchFinalDataAsync());
    }, 1000);
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
        // "fatherOccupation",
        // "motherOccupation",
        "shortlistStatus",
        "interviewer",
      ];
    }
    else if (fields.shortlistStatus == "NOTSHORTLISTED") {
      requiredFields = []
    }
    else {
      requiredFields = [
        "location",
        "qualification",
        "domainExperience",

        // "travelConstraint",


        "notificationPeriod",
        // "fatherOccupation",
        // "motherOccupation",
        "shortlistStatus",

      ];
    }


    requiredFields.forEach((field) => {
      if (!fields[field]) {
        errors[field] = `${field} is required.`;
      }
    });

    // Additional validation for domainExperience and notificationPeriod
    if (fields.shortlistStatus == "SHORTLISTED") {
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
    }


    return errors;
  };

  const handleSave = async () => {
    setSaveButtonLoading(true);

    try {

      const validationErrors = validateFields(selectedCard);
      // condition for waiting
      if (selectedCard.recruiterSubmissionStatus == 'SUBMITTED' && !selectedCard.joinDate && selectedCard.shortlistStatus === "SHORTLISTED") {
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
      setIsModalWaitingVisible(false);
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle the error as needed
    }
  };
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);


  const avatarUrl = process.env.PUBLIC_URL + "./img/avtr3.jpg";
  const handleIntChange = (value) => {
    setSelectedCard({ ...selectedCard, shortlistStatus: value });
  }
  const [techSaveButtonLoading, setTechSaveButtonLoading] = useState(false);

  const handleTechSave = () => {
    setTechSaveButtonLoading(true);

    if (!selectedCard.shortlistStatus) {

      console.error('Shortlist status not selected');
      return;
    }

    const token = localStorage.getItem('accessToken');
    const resumeId = selectedCard.resumeId;
    selectedCard.recruiterSubmissionStatus = 'TECH_SAVED';

    if (!selectedCard.interviewerorder.includes(selectedCard.interviewer[selectedCard.interviewer.length - 1])) {
      selectedCard.interviewerorder.push(selectedCard.interviewer[selectedCard.interviewer.length - 1])
    }
    axios.put(`https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/updatedata/${resumeId}/`, selectedCard, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {

        console.log('API call successful', response);

        handleModalTechClose();
        dispatch(fetchTasksAsync());
        dispatch(fetchFinalDataAsync());
        notification.success({
          message: 'Tech details saved successfully',
          duration: 1,
        });
      })
      .catch(error => {

        console.error('Error making API call', error);
        notification.error({
          message: 'Failed to save tech details',
          duration: 1,
        });

      })
      .finally(() => {
        // Reset loading state after operation completes (success or error)
        setTechSaveButtonLoading(false);
      });
  }
  const skillColors = ['lightblue', 'lightgreen', 'lightcoral', 'lightskyblue', 'lightpink', 'lightgoldenrodyellow', 'lightsalmon'];
  const checkConditions = (task) => {
    console.log("checkConditions", task)
    if (task.recruiterSubmissionStatus === "SAVED") {
      return false;
    }
    else if (task.recruiterSubmissionStatus === "TECH_SAVED") {
      if(task.canmove==true){
        return false;
      }
      else{
        return true;
      }

    }
    else {
      return true;
    }
  }
    return (
      <>
        <Kanbannav />
        <Button
          className="ncbtn"
          onClick={handleNewCandidateBtn}
        >
          <DirectionsWalkSharpIcon />
          Walk-in
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
                    <div

                      style={{
                        backgroundColor: "rgb(230, 230, 230)",
                        padding: "15px",
                        paddingTop: '20px',
                        borderBottom: "3px solid #0091ff",
                        borderRadius: "3px",
                        color: "rgb(62, 62, 62)",
                        fontSize: "1.4em",
                        fontWeight: "400",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        
                      }}
                    >
                      <div style={{ flex: 1, textAlign: 'center', paddingLeft: '10%' }}>
                        {column}
                      </div>

                      <div style={{ fontSize: "0.8em", color: "rgb(110,110,110)", backgroundColor: 'rgb(210,210,210)', paddingRight: '10px', paddingLeft: '10px', borderRadius: '5px', marginLeft: 'auto' }}>
                        {tasks[column].length}
                      </div>
                    </div>


                    <ul>
                      {tasks[column].map((task, index) => (

                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                          isDragDisabled={
                            // true
                            // if recruiter submission status is not saved it will true
                            // true false == false

                            checkConditions(task)
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
                                    || task.recruiterSubmissionStatus === "TECH_SAVED"
                                    ? "pointer"
                                    : "not-allowed",
                              }}
                            >
                              <div style={{ position: "relative", padding: '5%' }}>
                                {/* <img
                                className="avatarkan"
                                src={avatarUrl}
                                alt="User Avatar"
                              /> */}

                              <div>
                                <h3 style={{ fontWeight: '500', whiteSpace:'nowrap', overflow:'hidden',textOverflow:'ellipsis' }}>{task.name}</h3>

                                  {/* <p>Mail:{task.email}</p> */}
                                  {/* <div style={{border: '1px solid', borderRadius:'5px', padding:'10px', borderColor:'rgb(236, 236, 236)', fontWeight:'450' }}> */}
                                  <p style={{ display: 'flex', alignItems: 'center' }}><WorkOutlineIcon style={{ color: "rgb(88, 167, 204)" }} />    <div style={{ paddingLeft: '15px' }}> {task.jobRole}</div></p>
                                  <p style={{ display: 'flex', alignItems: 'center' }}><BeenhereIcon style={{ color: "rgb(88, 167, 204)" }} /> <div style={{ paddingLeft: '15px' }}> {task.yearsOfExperience} {task.yearsOfExperience === '1' ? "year" : "years"}</div></p>
                                  <p style={{ display: 'flex', alignItems: 'center' }}><LocalPhoneIcon style={{ color: "rgb(88, 167, 204)" }} />     <div style={{ paddingLeft: '15px' }}> {task.phoneNo}</div></p>
                                  {/* </div> */}
                                  {/* <div style={{border: '1px solid', borderRadius:'5px', padding:'3px', borderColor:'rgb(236, 236, 236)', marginTop:'3px', fontWeight:'500' }}> */}
                                  <p style={{ fontSize: '20px', fontWeight: 'lighter', marginBottom: '-3px', marginTop: '-3px' }}>{generateStars(task.resumeScore)}</p>
                                  {/* </div> */}


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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip>
              <Tooltip title="Email">
                <Input
                  placeholder="Email"
                  value={selectedCard.email}
                  onChange={(e) =>
                    setSelectedCard({ ...selectedCard, email: e.target.value })
                  }
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip>



              <Tooltip title="Location">
                <Input
                  placeholder="Location"
                  value={selectedCard.location}
                  onChange={(e) =>
                    setSelectedCard({ ...selectedCard, location: e.target.value })
                  }
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip>
              <Tooltip title="Total Experience">
                <Input
                  placeholder="Total Experience"
                  value={selectedCard.yearsOfExperience}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      yearsOfExperience: e.target.value,
                    })
                  }
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip>
              {/* <Tooltip title="Current Company">
                <Input
                  placeholder="Current Company"
                  value={selectedCard.currentCompany}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      currentCompany: e.target.value,
                    })
                  }
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip>
              <Tooltip title="Project's worked on">
                <Input
                  placeholder="Project's worked on"
                  value={selectedCard.projectWorkedOn}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      projectWorkedOn: e.target.value,
                    })
                  }
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip> */}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip>
              <Tooltip title="Travel">
                <Input
                  placeholder="Travel"
                  value={selectedCard.travelConstraint}
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                />
              </Tooltip>
              <Tooltip title="Notice Period">
                <Input
                  placeholder="Notice Period"
                  value={selectedCard.notificationPeriod}
                  onChange={(e) =>
                    setSelectedCard({
                      ...selectedCard,
                      notificationPeriod: e.target.value,
                    })
                  }
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
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
                  disabled={selectedCard && selectedCard.recruiterSubmissionStatus === "SUBMITTED"}
                >
                  <Option value="SHORTLISTED">Shortlisted</Option>
                  <Option value="NOTSHORTLISTED">Not Shortlisted</Option>
                </Select>
              </Tooltip>
              {selectedCard.shortlistStatus === "NOTSHORTLISTED" ? null :
                <>
                  {/* <Tooltip title="Interviewer">
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
                  <Toolkit interviewerList={interviewers} selectedcard={selectedCard} interviewers1={interviewers1} />

                  {/* <h1>hi</h1> */}
                </>

              }


            </div>

          )}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>

            {selectedCard && (selectedCard.recruiterSubmissionStatus === "SAVED" || selectedCard.recruiterSubmissionStatus == null) && (
              <>
                <Button
                  key="save"
                  type="primary"
                  onClick={handleSave}
                  loading={saveButtonLoading}
                >
                  Save
                </Button>
                <ChatButton key="chat" onClick={() => handleChat({
                  "username": selectedCard.name,
                  "email": selectedCard.email
                })} style={{ marginLeft: '10px' }} />
              </>
            )}

            <div style={{ marginLeft: 'auto' }}>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} />
            </div>

          </div>
          <hr style={{ margin: "40px 0" }} />
          {/* <div style={{ gridColumn: "1 / -1" }}>
        <h3>Past Company Details</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {selectedCard&& selectedCard.candidateHistory&& selectedCard.candidateHistory.length > 0 ? (
            selectedCard.candidateHistory.map((company, index) => (
              <Card key={index} style={{ marginBottom: '10px' }}>
                <Typography>
                  <strong>Company Name:</strong> 
                  <Input 
                    value={company.companyName} 
                    onChange={(e) => handleCompanyChange(index, 'name', e.target.value)}
                  />
                </Typography>
                <Typography>
                  <strong>Time Period:</strong> 
                  <Input 
                    value={company.timeinyears} 
                    onChange={(e) => handleCompanyChange(index, 'timePeriod', e.target.value)}
                  />
                </Typography>
                <Typography>
                  <strong>Projects Worked:</strong> 
                  <Input 
                    value={company.projects} 
                    onChange={(e) => handleCompanyChange(index, 'projects', e.target.value)}
                  />
                </Typography>
              </Card>
            ))
          ) : (
            <Typography>No company history available</Typography>
          )}
        </div>
      </div> */}
      <div style={{ gridColumn: "1 / -1" }}>
      <Title level={5}>Past Company Details</Title>
      <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '10px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
        {selectedCard && selectedCard.candidateHistory && selectedCard.candidateHistory.length > 0 ? (
          selectedCard.candidateHistory.map((company, index) => (
            <Card key={index} style={{ marginBottom: '10px' }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Text strong>Company Name:</Text>
                  <Input
                    value={company.companyName}
                    onChange={(e) => handleCompanyChange(index, 'companyName', e.target.value)}
                    style={{ marginBottom: '8px' }}
                  />
                </Col>
                <Col span={24}>
                  <Text strong>Time Period:</Text>
                  <Input
                    value={company.timerange}
                    onChange={(e) => handleCompanyChange(index, 'timerange', e.target.value)}
                    style={{ marginBottom: '8px' }}
                  />
                </Col>
                {/* <Col span={24}>
                  <Text strong>N.O years:</Text>
                  <Input
                    value={company.timeinyears}
                    onChange={(e) => handleCompanyChange(index, 'timeinyears', e.target.value)}
                    style={{ marginBottom: '8px' }}
                  />
                </Col> */}
                <Col span={24}>
                  <Text strong>Projects Worked:</Text>
                  <TextArea
                    value={company.projects}
                    onChange={(e) => handleCompanyChange(index, 'projects', e.target.value)}
                    rows={4}
                  />
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <Text>No company history available</Text>
        )}
      </div>
    </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <h3>Skills</h3>
            {selectedCard && selectedCard.llmskills ? (
              <p>
                {selectedCard.llmskills
                  .replace(/\[|\]|'/g, '')
                  .split(',')
                  .map((skill, index) => {
                    const skillWithoutNumbering = skill.trim();
                    return (
                      <span key={index} style={{ backgroundColor: skillColors[index % skillColors.length], borderRadius: '30px', display: 'inline-block', padding: '9px', marginRight: '5px', margin: '5px' }}>{skillWithoutNumbering}</span>
                    );
                  })}
              </p>
            ) : (
              <p>No skills data available</p>
            )}
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
              //   Clos
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
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>

            <Button
              key="save" type="primary"
              onClick={handleSave}
              loading={saveButtonLoading}
              style={{ marginTop: '10px' }}
            >
              Save
            </Button>
            <div style={{ marginLeft: 'auto' }}>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} />
            </div>
          </div>

        </Modal>
        <Modal
          title="Tech Details"
          visible={isModalTechVisible}
          onCancel={handleModalTechClose}
          width={540}
          footer={[]}
        >


          {selectedCard && (
            <div
              style={{
                display: "grid",
                gap: "5px",
                gridTemplateColumns: "1fr 1fr",
                marginTop: "2%",
              }}
            >

              <Typography>Resume ID: {selectedCard.resumeId}</Typography>

              <Typography style={{ marginLeft: "15%" }}>Name: {selectedCard.name}</Typography>

              <div style={{ marginTop: "10%" }}>
                <Toolkit
                  handletechmodal={handleModalTechClose}
                  interviewerList={interviewers}
                  selectedcard={selectedCard}
                  handleclick={handleModalOpen}
                  interviewers1={interviewers1}
                />
                {console.log(selectedCard)}
              </div>

              <div style={{ marginLeft: "15%", marginTop: "10%" }}>
              <Stepper
      activeStep={activeStep}
      orientation="vertical"
      style={{ textAlign: "center" }}
    >
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel
            sx={{
              '& .MuiStepIcon-root': {
                color: label === 'NOTSHORTLISTED' ? '#ff5a5a' : label === 'SHORTLISTED' ? '#2eab4d' : '#767676', // Change circle color based on step label and activeStep
              },
              '& .MuiStepLabel-label': {
                color: label === 'NOTSHORTLISTED' ? '#ff5a5a' : label === 'SHORTLISTED' ? '#2eab4d' : '#767676', // Change label text color based on step label and activeStep
              },
            }}
          >
            {label === 'NOTSHORTLISTED' ? 'Not Shortlisted' : label === 'SHORTLISTED' ? 'Shortlisted' : 'Yet to start'}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
              </div>
              <div style={{ marginTop: "10%" }}>
                <Select
                  placeholder="ShortListStatus"
                  value={selectedCard.shortlistStatus}
                  onChange={(value) => handleIntChange(value)}
                  style={{ width: 134, marginBottom: '5px', marginRight: '5px' }}
                >

                  <Option key="shortlisted" value="SHORTLISTED">
                    Shortlisted
                  </Option>
                  <Option key="notShortlisted" value="NOT SHORTLISTED">
                    Not Shortlisted
                  </Option>

                </Select>
                <Button
                  type="primary"
                  onClick={handleTechSave}
                >Save
                </Button>
              </div>
              <div style={{ marginLeft: "75%", marginTop: "9%" }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                />

              </div>{" "}
            </div>
          )}

        </Modal>
      </>
    );
  }
