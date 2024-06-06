
 
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveTask,
  fetchTasksAsync,
  updateTaskAsync,
  fetchInterviewerDataByIdAsync,
} from "../redux/slices/interviewerSlice";
import "../pages/kanban.css";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../redux/slices/authSlice";
import { Button, Modal, Form, Input, Rate, Select, Divider, message, notification } from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { PlusOutlined } from "@ant-design/icons";
import Kanbanintnav from "../components/usermanagement/Kanbanintnav";
import { DownloadOutlined } from '@ant-design/icons';
import axios from "axios";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
////////////////////////////////////////////////////////////////////////////////////////////

export default function KanbanInterviewer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.interviewer.tasks);
  const interData = useSelector((state) => state.interviewer.interViewerData);
  console.log("Data", interData);
  const [selectedTasks, setSelectedTasks] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [interViewerId, setInterViewerId] = useState("");
  const [interViewerData, setInterViewerData] = useState([]);
  const [interViewerStatus, setInterViewerStatus] = useState("");

  useEffect(() => {
    dispatch(fetchTasksAsync());
    // dispatch(fetchInterviewerDataByIdAsync());
  }, [dispatch]);

  const validateFields = (fields) => {
    const errors = {};
    let requiredFields = [];
    console.log("fields",fields);
    requiredFields = [
      "overall_comments",
      "overall_rating"
    ]

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        errors[field] = `${field} is required.`;
      }
    });
    return errors;
  }

  const handleDrop = (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Check if the source column is "Tech" and the destination column is  "Selected"
    if (
      source.droppableId === "Tech" &&
      destination.droppableId === "Completed"
    ) {
      // Prevent the drop action for cards from the "Assigned" column to  or "Selected"
      return;
    }

    // Check if the source column is "Waiting" and the destination column is  "Selected"
    if (
      source.droppableId === "Processed" &&
      destination.droppableId === "Completed"
    ) {
      // Prevent the drop action for cards from the "Waiting" column to  or "Selected"
      return;
    }
    if (
      source.droppableId === "Processed" &&
      destination.droppableId === "Tech"
    ) {
      // Prevent the drop action for cards from the "Waiting" column to   "tech"
      return;
    }

    if (
      source.droppableId === "Completed" &&
      destination.droppableId === "Tech"
      // || destination.droppableId === "Waiting"
    ) {
      // Prevent the drop action for cards from the "Selected" column to   "Tech"
      return;
    }
    if (
      source.droppableId === "Completed" &&
      destination.droppableId === "Processed"
      // || destination.droppableId === "Waiting"
    ) {
      // Prevent the drop action for cards from the "Selected" column to   "waiting"
      return;
    }

    // if (
    //   source.droppableId === "Tech" &&
    //   destination.droppableId === "Waiting"

    // ) {
    //   const validationErrors = validateFields();
    //   Object.values(validationErrors).forEach((errorMsg) => {
    //     notification.error({ message: errorMsg });
    //   });
    // }
    



    dispatch(
      moveTask({
        sourceColumn: source.droppableId,
        destinationColumn: destination.droppableId,
        sourceIndex: source.index,
        destinationIndex: destination.index,
      })
    );
    const updatedTask = tasks[source.droppableId][source.index];
    console.log("updated task", updatedTask);

    if (source.droppableId !== destination.droppableId) {
      // Ensure interViewerData is updated with the latest data
      dispatch(fetchInterviewerDataByIdAsync(updatedTask.resumeId))
        .then((response) => {
          const data = response.payload;
          setInterViewerData(data);
          
          dispatch(
            updateTaskAsync({
              ...data,
              submissionStatus: "SUBMITTED",
            })
          );

        })
        .catch((error) => {
          console.error("Error fetching interviewer data by ID:", error);

        });
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
  const handleCardClick = async (task) => {
    try {
      const response = await dispatch(
        fetchInterviewerDataByIdAsync(task.resumeId)
      );
      const data = response.payload;
      setInterViewerData(data);
      setInterViewerId(response.payload.id);
      setSelectedTasks({ [task.resumeId]: { ...task, ...data } });
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching interviewer data by ID:", error);
      // Handle error as needed
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTasks({});
  };
  const [saving, setSaving] = useState(false);
  const handleModalSubmit = async (updatedData) => {
    setSaving(true);
    console.log("Updated data:", updatedData);
    // if (!updatedData || !updatedData.values || !updatedData.values.skills) {
    if (!updatedData || !updatedData.values) {
      console.error("Invalid updatedData object:", updatedData);
      return;
    }

    const validationErrors = validateFields(updatedData.values);
      

      if(Object.keys(validationErrors).length !== 0){
        console.log("validation Errors", validationErrors)
        console.log("Entering If")
        Object.values(validationErrors).forEach((errorMsg) => {
          notification.error({ message: errorMsg });
        });
        return;
      }


    const updatedTask = {
      ...updatedData.values,
      submissionStatus: "SAVED",
      candidateName: updatedData.values.name,
      id: interViewerId,
      skills: updatedData.values.skills || []
    };


    // console.log("before save");
    // dispatch(updateTaskAsync(updatedTask));
    // setSaving(false); 
    // setIsModalVisible(false);
    // message.success("Candidate details saved successfully!");
    // setSelectedTasks({});

    try {
      await dispatch(updateTaskAsync(updatedTask));
      setIsModalVisible(false);
      setSelectedTasks({});
      setSaving(false);

    } catch (error) {
      console.error("Error updating task:", error);
      setSaving(false); // Reset loading state if an error occurs

    }

  };
  const handleDownload = async (selectedTask) => {
    console.log(selectedTask.resumeId);
    const resumeId = selectedTask.resumeId;
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


  const avatarUrl = process.env.PUBLIC_URL + "./img/avtr3.jpg";
  const { Option } = Select;
  const handleRemoveSkill = async (index, skills) => {
    try {
      // Get the skill to delete
      console.log('index', index);
      console.log('skills', skills.skills[index].id);


      await axios.delete(`https://hireflowapidev.focusrtech.com:90/hiring/interviewer/deleteskill/${skills.skills[index].id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

    } catch (error) {
      console.error('Error deleting skill:', error);

      message.error('unable to delete skill')
      // Handle error as needed
    }
  };
  return (
    <>
      <Kanbanintnav />
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
                    <div style={{ flex: 1, textAlign: 'center', paddingLeft: '10%'}}>
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
                      // isDragDisabled={task.submissionStatus !== "SAVED"}
                      >
                        {(provided) => (
                          <li
                            onClick={() => handleCardClick(task)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ position: "relative", padding: '5%' }}>
                              {/* <img
                                className="avatarkan"
                                src={avatarUrl}
                                alt="User Avatar"
                              /> */}

                              <div>
                                <h3 style={{ fontWeight: '500' }}>{task.name}</h3>
                                {/* <p>Mail:{task.email}</p> */}
                                {/* <div style={{border: '1px solid', borderRadius:'5px', padding:'10px', borderColor:'rgb(236, 236, 236)', fontWeight:'450' }}> */}
                                <p style={{ display: 'flex', alignItems: 'center' }}><WorkOutlineIcon style={{ color: "rgb(88, 167, 204)" }} />    <div style={{ paddingLeft: '15px' }}> {task.jobRole}</div></p>
                                <p style={{ display: 'flex', alignItems: 'center' }}><BeenhereIcon style={{ color: "rgb(88, 167, 204)" }} /> <div style={{ paddingLeft: '15px' }}> {task.yearsOfExperience} {task.yearsOfExperience === '1' ? "year" : "years"}</div></p>
                                {/* <p style={{ display: 'flex', alignItems: 'center' }}><LocalPhoneIcon style={{ color: "rgb(88, 167, 204)" }} />     <div style={{ paddingLeft: '15px' }}> {task.phoneNo}</div></p> */}
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
                </div>
              )}
            </Droppable>
            
          ))}
        </div>
      </DragDropContext>

      <Modal
        title={"Edit Candidate Details"}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {selectedTasks &&
          Object.values(selectedTasks).map((selectedTask) => (
            <Form
              key={selectedTask.id}
              onFinish={(values) => handleModalSubmit({ values })}
              initialValues={selectedTask}
            >
              {" "}
              {/* <Form.Item label="ID" name="id">
                <Input disabled />
              </Form.Item> */}
              <Form.Item label="Candidate Name" name="name">
                <Input disabled={selectedTask.submissionStatus === "SUBMITTED"} />
              </Form.Item>
              <Form.Item label="Resume ID" name="resumeId">
                <Input disabled={selectedTask.submissionStatus === "SUBMITTED"} />
              </Form.Item>
              <Form.Item label="Strength" name="strength">
                <Input disabled={selectedTask.submissionStatus === "SUBMITTED"} />
              </Form.Item>
              <Form.Item label="Weakness" name="weakness">
                <Input disabled={selectedTask.submissionStatus === "SUBMITTED"} />
              </Form.Item>
              <Form.Item label="Shortlist Status" name="shortlistStatus">
                <Select disabled={selectedTask.submissionStatus === "SUBMITTED"}>
                  <Option value="SHORTLISTED">SHORTLISTED</Option>
                  <Option value="NOTSHORTLISTED">NOTSHORTLISTED</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Overall Comments" name="overall_comments">
                <Input.TextArea disabled={selectedTask.submissionStatus === "SUBMITTED"} />
              </Form.Item>
              <Form.Item label="Overall Rating" name="overall_rating">
                <Rate disabled={selectedTask.submissionStatus === "SUBMITTED"} />
              </Form.Item>
              <Form.Item label="Remarks" name="remarks">
                <Input disabled={selectedTask.submissionStatus === "SUBMITTED"} />
              </Form.Item>
              <Divider>Skills</Divider>
              <Form.List name="skills">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <div key={key} style={{ marginBottom: "16px" }}>
                        <Form.Item
                          label={`Skill ${key + 1}`}
                          {...restField}
                          name={[name, "skills"]}
                          fieldKey={[fieldKey, "skills"]}
                        >
                          <Input placeholder="Skill" disabled={selectedTask.submissionStatus === "SUBMITTED"} />
                        </Form.Item>
                        <Form.Item
                          label={`Proficiency ${key + 1}`}
                          {...restField}
                          name={[name, "proficiency"]}
                          fieldKey={[fieldKey, "proficiency"]}
                        >
                          <Input placeholder="Proficiency" disabled={selectedTask.submissionStatus === "SUBMITTED"} />
                        </Form.Item>
                        <Form.Item
                          label={`Rating (out of 10) ${key + 1}`}
                          {...restField}
                          name={[name, "ratingoutof10"]}
                          fieldKey={[fieldKey, "ratingoutof10"]}
                        >
                          <Input
                            placeholder="Rating out of 10"
                            type="number"
                            min={0}
                            max={10}
                            disabled={selectedTask.submissionStatus === "SUBMITTED"}
                          />
                        </Form.Item>
                        <Form.Item
                          label={`Comments ${key + 1}`}
                          {...restField}
                          name={[name, "comments"]}
                          fieldKey={[fieldKey, "comments"]}
                        >
                          <Input.TextArea placeholder="Comments" disabled={selectedTask.submissionStatus === "SUBMITTED"} />
                        </Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => { remove(name); handleRemoveSkill(name, selectedTask); }}
                          style={{ width: "100%" }}
                          disabled={selectedTask.submissionStatus === "SUBMITTED"}
                        >
                          Remove Skill
                        </Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        disabled={selectedTask.submissionStatus === "SUBMITTED"}
                      >
                        Add Skill
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item>

                {selectedTask.submissionStatus != "SUBMITTED" &&
                  <Button type="primary" htmlType="submit">
                    SAVE
                  </Button>
                }
                <Button type="primary" icon={<DownloadOutlined />} onClick={()=>handleDownload(selectedTask)} style={{ marginLeft: "20px" }} />
              </Form.Item>
            </Form>
          ))}
      </Modal>


    </>
  );
}
 