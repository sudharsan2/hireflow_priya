
import React, { useEffect, useState } from "react";
import Cannav from "../../components/usermanagement/Cannav";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Empty,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  message
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  fetchCandidateDetailsAsync,
  fetchInterviewerRemarksAsync,
  fetchListofInterviewerAsync,
  fetchListofRecruiterAsync,
  fetchListofSourceAsync,
  updateCandidateDataAsync,
  setErrorMessage,
  getLoadingState,
  getErrorState,
} from "../../redux/slices/summarySlice";
import { Typography } from "@mui/material";
import Usernav from "../../components/usermanagement/Usernav";
import Kanbanintnav from "../../components/usermanagement/Kanbanintnav";
import axios from "axios";
import { DownloadOutlined } from '@ant-design/icons';
////////////////////////////////////////////////////////////
 
const { Option } = Select;
 
const TechSummary = () => {
  const [loadings, setLoadings] = useState(false);
  const loading = useSelector(getLoadingState);
  const error = useSelector(getErrorState);
 
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const interviewers = useSelector((state) => state.summary.interviewers);
  const recruiters = useSelector((state) => state.summary.recruiters);
  const source = useSelector((state) => state.summary.source);
  const interviewerRemarks = useSelector(
    (state) => state.summary.interviewerRemarks
  );
  console.log("remarks", interviewerRemarks);
  const [formData, setFormData] = useState({
    resumeId: "",
    candidateName: "",
    resumeScore: "",
    jobRole: "",
    recruiterName: "",
    recruiterStatus: "",
    recruiterDate: null,
    interviewerName: "",
    interviewerStatus: "",
    interviewerDate: null,
    status: "",
    source: "",
  });
 
  const [editFormData, setEditFormData] = useState({
    // Initialize with empty values or values you want to start with
    resumeId: "",
    candidateName: "",
    resumeScore: "",
    jobRole: "",
    recruiterName: "",
    recruiterStatus: "",
    recruiterDate: null,
    interviewerName: "",
    interviewerStatus: "",
    interviewerDate: null,
    status: "",
    source: "",
  });
  // State to hold fetched candidate details
  const [candidates, setCandidates] = useState([]);
  
  const handleDownload = async (record) => {
    console.log(record.resumeId);
    const resumeId = record.resumeId;
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


  const handleChange = (field, value) => {
    if (field === "fromDate" || field === "toDate" || field === "recruiterDate" || field === "interviewerDate") {
      const forvalue=value
      value = value ? value.format("YYYY-MM-DD") : null;
      setFormData({
        ...formData,
        ["unformated"+field]: forvalue,
        [field]:value
      });
    }
    else {
      console.log("value outside if", value);
      setFormData({
        ...formData,
        [field]: value,
      });
    }
 
 
    console.log(formData);
  };
 
  const handleEdit = (record) => {
    setEditFormData(record);
    setEditModalVisible(true);
  };
 
  const fetchCandidateDetails = async () => {
    try {
      // Filter out fields with empty values
      setLoadings(true);
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );
      const data = await dispatch(fetchCandidateDetailsAsync(filteredData));
      console.log("Data", data.payload);
      const value = data.payload;
      setCandidates(value);
    } catch (error) {
      console.log("Error fetching candidate details:", error);
      dispatch(setErrorMessage("Error fetching candidate details"));
      return;
    } finally {
      setLoadings(false);
    }
  };
 
  useEffect(() => {
    dispatch(fetchListofInterviewerAsync());
    dispatch(fetchListofRecruiterAsync());
    dispatch(fetchListofSourceAsync());
  }, []);
 
  const columns = [
    {
      title: "Resume ID",
      dataIndex: "resumeId",
      key: "resumeId",
    },
    {
      title: "Candidate Name",
      dataIndex: "name",
      key: "candidateName",
    },
    {
      title: "Score",
      dataIndex: "resumeScore",
      key: "score",
    },
    {
      title: "Experience",
      dataIndex: "yearsOfExperience",
      key: "experience",
    },
    {
      title: "Job Role",
      dataIndex: "jobRole",
      key: "role",
    },
    {
      title: "Recruiter",
      dataIndex: "assigned",
      key: "recruiter",
    },
    {
      title: "Recruit Status",
      dataIndex: "recruiterSubmissionStatus",
      key: "recruitStatus",
    },
    {
      title: "Current Status",
      dataIndex: "currentStatus",
      key: "currentStatus",
    },
    {
      title: "Resume",
      key: "downloadResume",
      render: (_, record) => (
        // <Button type="primary" onClick={() => handleDownload(record)}>
        //   download
        // </Button>
        <DownloadOutlined onClick={()=>handleDownload(record)} style={{ cursor: "pointer", display: "flex", justifyContent: "center" }}/>
      )
    },
    // {
    //   title: "Edit",
    //   key: "edit",
    //   render: (_, record) => (
    //     <Button type="primary" onClick={() => handleEdit(record)}>
    //       Edit
    //     </Button>
    //   ),
    // },
    // {
    //   title: "Interviewer",
    //   key: "interviewer",
    //   render: (_, record) => (
    //     <Button type="primary" onClick={() => handleInterviewerClick(record)}>
    //       Interviewer
    //     </Button>
    //   ),
    // },
    // Add more columns as needed
  ];
 
  const clearForm = () => {
    setFormData({
      ...formData,
      resumeId: "",
      candidateName: "",
      resumeScore: "",
      jobRole: "",
      recruiterName: "",
      recruiterStatus: "",
      recruiterDate: null,
      interviewerName: "",
      interviewerStatus: "",
      interviewerDate: null,
      status: "",
    });
  };
  const clearForm1 = () => {
    setFormData({
      resumeId: "",
      candidateName: "",
      resumeScore: "",
      jobRole: "",
      recruiterName: "",
      recruiterStatus: "",
      recruiterDate: null,
      interviewerName: "",
      interviewerStatus: "",
      interviewerDate: null,
      status: "",
    });
  };
 
  const handleSave = async () => {
    try {
      setLoadings(true);
      // Dispatch the async thunk action to update the data
      await dispatch(updateCandidateDataAsync(editFormData));
 
      // Close the modal or handle any other actions upon successful update
      setEditModalVisible(false);
      // Optionally, fetch updated candidate details
      fetchCandidateDetails();
    } catch (error) {
      // Handle errors
      console.error("Error updating candidate data:", error);
      // Optionally, display an error message to the user
    } finally {
      setLoadings(false);
    }
  };
 
  const handleInterviewerClick = async (record) => {
    try {
      // Dispatch the fetchInterviewerRemarksAsync thunk with the resumeId
      dispatch(fetchInterviewerRemarksAsync(record.resumeId));
 
      // Open the modal with the response data or handle it as needed
      setSelectedCandidate(record);
      setModalVisible(true);
    } catch (error) {
      // Handle errors
      console.error("Error fetching interviewer remarks:", error);
      // Optionally, display an error message to the user
    }
  };
  return (
    <>
      <Kanbanintnav />
      <Card
        title="Find Candidate Details"
        bordered={false}
        style={{ margin: "70px" }}
      >
        <Space
          direction="vertical"
          size="large"
          style={{
            display: "flex",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Input
                placeholder="Resume Id"
                value={formData.resumeId}
                onChange={(e) => handleChange("resumeId", e.target.value)}
              />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Source"
                value={formData.source || undefined}
                onChange={(value) => handleChange("source", value)}
              >
                {source.map((src) => (
                  <Option key={src.id} value={src.id}>
                    {src.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <Input
                placeholder="Candidate Name"
                value={formData.candidateName}
                onChange={(e) => handleChange("candidateName", e.target.value)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Input
                type="number"
                placeholder="Resume Score"
                value={formData.resumeScore}
                onChange={(e) => handleChange("resumeScore", e.target.value)}
              />
            </Col>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px" }}
                placeholder="From Date"
                value={formData.unformatedfromDate ? formData.unformatedfromDate : null}
                onChange={(date) => handleChange("fromDate", date)}
              />
            </Col>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px" }}
                placeholder="To Date"
                value={formData.unformatedtoDate ? formData.unformatedtoDate : null}
                onChange={(date) => handleChange("toDate", date)}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Job Role"
                value={formData.jobRole || undefined}
                onChange={(value) => handleChange("jobRole", value)}
              >
                <Option value="Oracle Apps Technical Consultant">
                  Oracle Apps Technical Consultant
                </Option>
                <Option value="Java Full Stack developer">
                  Java Full Stack developer
                </Option>
                <Option value="Oracle Apps DBA">Oracle Apps DBA</Option>
                <Option value="Oracle Finance Functional Consultant">
                  Oracle Finance Functional Consultant
                </Option>
                <Option value="Oracle HRMS consultant">
                  Oracle HRMS consultant
                </Option>
                <Option value="Oracle SCM consultant">
                  Oracle SCM consultant
                </Option>
                <Option value="Fresher">Fresher</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Recruiter Name"
                value={formData.recruiterName || undefined}
                onChange={(value) => handleChange("recruiterName", value)}
              >
                {recruiters.map((recruiter) => (
                  <Option key={recruiter.id} value={recruiter.empId}>
                    {recruiter.username}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Recruiter Status"
                value={formData.recruiterStatus || undefined}
                onChange={(value) => handleChange("recruiterStatus", value)}
              >
                <Option value="SHORTLISTED">SHORTLISTED</Option>
                <Option value="NOTSHORTLISTED">NOT SHORTLISTED</Option>
                <Option value="HOLD">HOLD</Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px" }}
                placeholder="Recruiter Date"
                value={formData.unformatedrecruiterDate ? formData.unformatedrecruiterDate : null}
                onChange={(date) => handleChange("recruiterDate", date)}
              />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Interviewer Name"
                value={formData.interviewerName || undefined}
                onChange={(value) => handleChange("interviewerName", value)}
              >
                {interviewers.map((interviewer) => (
                  <Option key={interviewer.id} value={interviewer.empId}>
                    {interviewer.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Interviewer Status"
                value={formData.unformatedinterviewerDate ? formData.unFormatedinterviewerDate : null}
                onChange={(value) => handleChange("interviewerStatus", value)}
              >
                <Option value="SHORTLISTED">SHORTLISTED</Option>
                <Option value="NOTSHORTLISTED">NOT SHORTLISTED</Option>
                {/* Add more options as needed */}
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px" }}
                placeholder="Interviewer Date"
                value={formData.unformatedinterviewerDate ? formData.unFormatedinterviewerDate : null}
                onChange={(value) => handleChange("interviewerDate", value)}
              />
            </Col>
            <Col span={8}>
              <Select
                placeholder="Status"
                style={{ width: "100%" }}
                value={formData.status || undefined}
                onChange={(value) => handleChange("status", value)}
              >
                <Option value="NOT_ASSIGNED">NOT ASSIGNED</Option>
                <Option value="ASSIGNED">ASSIGNED</Option>
                <Option value="IN_ENTRY">IN ENTRY</Option>
                <Option value="IN_TECH">IN TECH</Option>
                <Option value="IN_FINAL">IN FINAL</Option>
                <Option value="SELECTED">SELECTED</Option>
                <Option value="COMPLETED">COMPLETED</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                loading={loadings}
                onClick={() => {
                  fetchCandidateDetails();
                  clearForm();
                  setShowTable(true); // Set showTable to true when clicking the button
                }}
              >
                Find
              </Button>
              <Button
                style= {{marginLeft : "10px"}}
                type="primary"
                icon={<SyncOutlined />}
                loading={loadings}
                onClick={() => {
                  
                  clearForm1();
                  setShowTable(false); // Set showTable to true when clicking the button
                }}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>
      {showTable && (
        <Card
          title="Candidate Details"
          bordered={false}
          style={{ margin: "70px", overflow:"auto"}}
        >
          {candidates.length > 0 ? (
            <Table dataSource={candidates} columns={columns} />
          ) : (
            <Empty />
          )}
        </Card>
      )}
      {/* Edit Modal */}
      <Modal
        title="Edit Candidate Details"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSave}
        confirmLoading={loadings} // Set confirmLoading to the loading state
      >
        <div
          style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          <Tooltip title="Resume Id">
            <Input
              placeholder="Resume Id"
              value={editFormData.resumeId}
              onChange={(e) =>
                setEditFormData({ ...editFormData, resumeId: e.target.value })
              }
            />
          </Tooltip>
          <Tooltip title="Candidate Name">
            <Input
              placeholder="Candidate Name"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
            />
          </Tooltip>
          <Tooltip title="Resume Score">
            <Input
              placeholder="Resume Score"
              value={editFormData.resumeScore}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  resumeScore: e.target.value,
                })
              }
            />
          </Tooltip>
          <Tooltip title="Experience">
            <Input
              placeholder="Experience"
              value={editFormData.yearsOfExperience}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  yearsOfExperience: e.target.value,
                })
              }
            />
          </Tooltip>
          <Tooltip title="Job Role">
            <Select
              style={{ width: "100%" }}
              placeholder="Job Role"
              value={editFormData.jobRole}
              onChange={(value) =>
                setEditFormData({ ...editFormData, jobRole: value })
              }
            >
              <Option value="Oracle Apps Technical Consultant">
                Oracle Apps Technical Consultant
              </Option>
              <Option value="Java Full Stack developer">
                Java Full Stack developer
              </Option>
              <Option value="Oracle Apps DBA">Oracle Apps DBA</Option>
              <Option value="Oracle Finance Functional Consultant">
                Oracle Finance Functional Consultant
              </Option>
              <Option value="Oracle HRMS consultant">
                Oracle HRMS consultant
              </Option>
              <Option value="Oracle SCM consultant">
                Oracle SCM consultant
              </Option>
              <Option value="Fresher">Fresher</Option>
            </Select>
          </Tooltip>
          <Tooltip title="Recruiter">
            <Select
              style={{ width: "100%" }}
              placeholder="Recruiter Name"
              value={editFormData.assigned}
              onChange={(value) =>
                setEditFormData({
                  ...editFormData,
                  assigned: value,
                })
              }
            >
              {recruiters.map((recruiter) => (
                <Option key={recruiter.id} value={recruiter.empId}>
                  {recruiter.username}
                </Option>
              ))}
            </Select>
          </Tooltip>
          <Tooltip title="Recruiter Status">
            <Select
              style={{ width: "100%" }}
              placeholder="Recruiter Status"
              value={editFormData.recruiterSubmissionStatus}
              onChange={(value) =>
                setEditFormData({
                  ...editFormData,
                  recruiterSubmissionStatus: value,
                })
              }
            >
              <Option value="SHORTLISTED">SHORTLISTED</Option>
              <Option value="NOTSHORTLISTED">NOT SHORTLISTED</Option>
              <Option value="HOLD">HOLD</Option>
            </Select>
          </Tooltip>
          <Tooltip title="Status">
            <Select
              placeholder="Status"
              style={{ width: "100%" }}
              value={editFormData.currentStatus}
              onChange={(value) =>
                setEditFormData({ ...editFormData, currentStatus: value })
              }
            >
              <Option value="NOT_ASSIGNED">NOT ASSIGNED</Option>
              <Option value="ASSIGNED">ASSIGNED</Option>
              <Option value="IN_ENTRY">IN ENTRY</Option>
              <Option value="IN_TECH">IN TECH</Option>
              <Option value="IN_FINAL">IN FINAL</Option>
              <Option value="SELECTED">SELECTED</Option>
              <Option value="COMPLETED">COMPLETED</Option>
            </Select>
          </Tooltip>
        </div>
      </Modal>
      {/* Interviewer Remarks Modal */}
 
      <Modal
        title="Interviewer Remarks"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Divider />
        <p>
          <strong>Interviewer:</strong> {interviewerRemarks?.interviewerName}
        </p>
        <p>
          <strong>Date And Time:</strong> {interviewerRemarks?.dateTime}
        </p>
        <p>
          <strong>Overall Rating:</strong> {interviewerRemarks?.overall_rating}
        </p>
 
        <ul style={{ listStyle: "none", padding: 0 }}>
          {" "}
          {interviewerRemarks?.skills.map((skill, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              {" "}
              <a onClick={() => setSelectedSkill(skill)}>View Skill Details</a>
              <Modal
                title="Skill Details"
                visible={!!selectedSkill}
                onCancel={() => setSelectedSkill(null)}
                footer={null}
              >
                <Card>
                  <p>
                    <strong>Skill:</strong> {selectedSkill?.skills}
                  </p>
                  <p>
                    <strong>Proficiency:</strong> {selectedSkill?.proficiency}
                  </p>
                  <p>
                    <strong>Rating out of 10:</strong>{" "}
                    {selectedSkill?.ratingoutof10}
                  </p>
                  <p>
                    <strong>Comments:</strong> {selectedSkill?.comments}
                  </p>
                </Card>
              </Modal>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};
 
export default TechSummary;