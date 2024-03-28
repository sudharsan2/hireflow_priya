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
import { Button, Modal, Form, Input, Rate, Select, Divider, message} from "antd";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { PlusOutlined } from "@ant-design/icons";
import Kanbanintnav from "../components/usermanagement/Kanbanintnav";
import { DownloadOutlined } from '@ant-design/icons';
import axios from "axios";
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
      destination.droppableId === "Selected"
    ) {
      // Prevent the drop action for cards from the "Assigned" column to  or "Selected"
      return;
    }

    // Check if the source column is "Waiting" and the destination column is  "Selected"
    if (
      source.droppableId === "Waiting" &&
      destination.droppableId === "Selected"
    ) {
      // Prevent the drop action for cards from the "Waiting" column to  or "Selected"
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
    console.log("updated task", updatedTask);

    if (source.droppableId !== destination.droppableId) {
      // Ensure interViewerData is updated with the latest data
      dispatch(fetchInterviewerDataByIdAsync(updatedTask.resumeId))
        .then((response) => {
          const data = response.payload;
          setInterViewerData(data);

          dispatch(
            updateTaskAsync({
              ...data, // Use the latest interViewerData
              submissionStatus: "SUBMITTED",
            })
          );
        })
        .catch((error) => {
          console.error("Error fetching interviewer data by ID:", error);
          // Handle error as needed
        });
    }
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

  const handleModalSubmit = (updatedData) => {
    console.log("Updated data:", updatedData);
    if (!updatedData || !updatedData.values || !updatedData.values.skills) {
      console.error("Invalid updatedData object:", updatedData);
      return;
    }

    const updatedTask = {
      ...updatedData.values,
      submissionStatus: "SAVED",
      candidateName: updatedData.values.name,
      id: interViewerId,
      skills: updatedData.values.skills || []
    };

    // delete updatedTask.name;
    // const skillsToDelete = updatedData.initialValues.skills.filter(skill => !updatedTask.skills.includes(skill.skills));
    // if (skillsToDelete.length > 0) {
    //   // Iterate over skills to delete and make API calls
    //   skillsToDelete.forEach(skill => {
    //     // Replace `<int:id>` with the actual ID value
    //     fetch(`http://172.235.10.116:7000/hiring/interviewer/deleteskill/${skill.id}`, {
    //       method: 'DELETE',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       // You may need to include credentials or authorization headers if required
    //     })
    //       .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         // Handle successful deletion
    //       })
    //       .catch(error => {
    //         console.error('Error deleting skill:', error);
    //         // Handle error as needed
    //       });
    //   });
    // }
    console.log("before save");
    dispatch(updateTaskAsync(updatedTask));
    setIsModalVisible(false);
    setSelectedTasks({});
  };
  const handleDownload = async () => {
    console.log(selectedTasks.resumeId);
    const resumeId = selectedTasks.resumeId;
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


  const avatarUrl = process.env.PUBLIC_URL + "./img/avtr3.jpg";
  const { Option } = Select;
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
                            <div style={{ position: "relative" }}>
                              {/* <img
                                className="avatarkan"
                                src={avatarUrl}
                                alt="User Avatar"
                              /> */}

                              <div>
                                <h2>{task.name}</h2>
                                <p>Job Role: {task.jobRole}</p>
                                <p>Mail:{task.email}</p>
                                <p>phone:{task.phoneNo}</p>
                                <p className="score">{task.resumeScore}</p>
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
                <Input />
              </Form.Item>
              <Form.Item label="Resume ID" name="resumeId">
                <Input />
              </Form.Item>
              <Form.Item label="Strength" name="strength">
                <Input />
              </Form.Item>
              <Form.Item label="Weakness" name="weakness">
                <Input />
              </Form.Item>
              <Form.Item label="Shortlist Status" name="shortlistStatus">
                <Select>
                  <Option value="SHORTLISTED">SHORTLISTED</Option>
                  <Option value="NOTSHORTLISTED">NOTSHORTLISTED</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Overall Comments" name="overall_comments">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Overall Rating" name="overall_rating">
                <Rate />
              </Form.Item>
              <Form.Item label="Remarks" name="remarks">
                <Input />
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
                          <Input placeholder="Skill" />
                        </Form.Item>
                        <Form.Item
                          label={`Proficiency ${key + 1}`}
                          {...restField}
                          name={[name, "proficiency"]}
                          fieldKey={[fieldKey, "proficiency"]}
                        >
                          <Input placeholder="Proficiency" />
                        </Form.Item>
                        <Form.Item
                          label={`Rating out of 10 ${key + 1}`}
                          {...restField}
                          name={[name, "ratingoutof10"]}
                          fieldKey={[fieldKey, "ratingoutof10"]}
                        >
                          <Input
                            placeholder="Rating out of 10"
                            type="number"
                            min={0}
                            max={10}
                          />
                        </Form.Item>
                        <Form.Item
                          label={`Comments ${key + 1}`}
                          {...restField}
                          name={[name, "comments"]}
                          fieldKey={[fieldKey, "comments"]}
                        >
                          <Input.TextArea placeholder="Comments" />
                        </Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => remove(name)}
                          style={{ width: "100%" }}
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
                      >
                        Add Skill
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item>
                
                <Button type="primary" htmlType="submit">
                  SAVE
                </Button>
                <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload} style={{marginLeft:"20px"}}/>
              </Form.Item>
            </Form>
          ))}
      </Modal>


    </>
  );
}
