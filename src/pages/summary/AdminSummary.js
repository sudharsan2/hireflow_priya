
import React, { useEffect, useState } from "react";
import moment from "moment";
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
  message,
} from "antd";
import { SyncOutlined,ArrowDownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCandidateDetailsAsync,
  fetchInterviewerRemarksAsync,
  fetchListofInterviewerAsync,
  fetchListofRecruiterAsync,
  fetchListofSourceAsync,
  updateCandidateDataAsync,
  updateAdminCandidateDataAsync,
  setErrorMessage,
  getLoadingState,
  getErrorState,
} from "../../redux/slices/summarySlice";
import { Typography } from "@mui/material";
import Usernav from "../../components/usermanagement/Usernav";
import { DownloadOutlined } from '@ant-design/icons';
import axios from "axios";
 
 
 
 
 
 
////////////////////////////////////////////////////////////
 
const { Option } = Select;
 
const AdminSummary = () => {
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
    fromDate: null,
    toDate: "",
  });
 
  const [showEditFormData, setShowEditFormData] = useState({
    resumeId: "",
    // candidateName: "",
    resumeScore: "",
    jobRole: "",
    // recruiterName: "",
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
    // candidateName: "",
    resumeScore: "",
    jobRole: "",
    // recruiterName: "",
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
 
  const handleChange = (field, value) => {
    if (field === "fromDate" || field === "toDate" || field === "recruiterDate" || field === "interviewerDate") {
      const forvalue = value
      value = value ? value.format("YYYY-MM-DD") : null;
      setFormData({
        ...formData,
        ["unformated" + field]: forvalue,
        [field]: value
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
  
  const exportData = async () => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== "")
      );
      const response = await axios.post('https://hireflowapidev.focusrtech.com:90/hiring/auth/exportSummary', filteredData, {
        responseType: 'blob' // Important for handling binary data
      });

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.xlsx'); // Name of the file
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };


  const handleFromDateChange = (date) => {
    handleChange("fromDate", date);
    console.log("date", formData.fromDate);
    console.log("moment", moment("2024-03-27", "YYYY-MM-DD"));
    console.log("formData", formData);
  };
 
  const handleToDateChange = (date) => {
 
    handleChange("toDate", date);
  };
  const handleRecruiterDateChange = (date) => {
    handleChange("recruiterDate", date);
  };
  const handleInterviewerDateChange = (date) => {
    handleChange("interviewerDate", date);
  };
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
  
  const handleEdit = (record) => {
    setShowEditFormData(record);
    setEditFormData({
      ...editFormData,
      resumeId: record.resumeId,
      resumeScore: record.resumeScore,
      jobRole: record.jobRole,
    })
    setEditModalVisible(true);
    console.log('formDatashow', showEditFormData);
 
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
      console.log("again");
      const value = data.payload;
      setCandidates(value);
    } catch (error) {
      console.log("Error fetching candidate details:", error);
      dispatch(setErrorMessage("Error fetching candidate details"));
    } finally {
      setLoadings(false);
    }
  };
 
  useEffect(() => {
    dispatch(fetchListofInterviewerAsync());
    dispatch(fetchListofRecruiterAsync());
    dispatch(fetchListofSourceAsync());
  }, []);
  //   Skill: Progrmming
 
  // Proficiency: profiency
 
  // Rating out of 10: 9
 
  // Comments: comments
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const handleSkills = (record) => {
    setShowSkillsModal(true);
    console.log('record', record.skills);
    setSkills(record.skills);
  }
  const skillsColumns = [
    {
      title: "Skill",
      dataIndex: "skills",
      key: "skills",
    },
    {
      title: "Proficiency",
      dataIndex: "proficiency",
      key: "proficiency",
    },
    {
      title: "Rating out of 10",
      dataIndex: "ratingoutof10",
      key: "ratingoutof10",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    }
  ]
  const interviewerColumns = [
    {
      title: "interviewer",
      dataIndex: "interviewerName",
      key: "interviewerName",
    },
    {
      title: "Interviewer Time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Shortlist Status",
      dataIndex: "shortlistStatus",
      key: "shortlistStatus",
    },
    {
      title: "Strength",
      dataIndex: "Strength",
      key: "Strength",
    },
    {
      title: "Weakness",
      dataIndex: "weakness",
      key: "weakness",
    },
    {
      title: "Overall Rating",
      dataIndex: "overall_rating",
      key: "overall_rating",
    },
    {
      title: "Overall comments",
      dataIndex: "overall_comments",
      key: "overall_comments",
    },
    {
      title: "skills",
      key: "skills",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleSkills(record)}>
          skills
        </Button>
      ),
    },
  ]
  //   const skillsData = [
  //     {
  //         "id": 3,
  //         "skills": "ewret",
  //         "proficiency": "regtr",
  //         "ratingoutof10": 10,
  //         "comments": "rgetr",
  //         "techReview": 7
  //     }
  // ];
  const skillsData = interviewerRemarks ? interviewerRemarks.skills : '';
  const [skills, setSkills] = useState([]);
 
  const interviwewerData = interviewerRemarks;
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
      dataIndex: "shortlistStatus",
      key: "shortlistStatus",
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
        <DownloadOutlined onClick={() => handleDownload(record)} style={{ cursor: "pointer", display: "flex", justifyContent: "center" }} />
        // <DownloadOutlined onClick={() => handleDownload(record)} style={{ cursor: "pointer", display: "flex", justifyContent: "center" }} />
      )
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
    {
      title: "Interviewer",
      key: "interviewer",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleInterviewerClick(record)}>
          Interviewer
        </Button>
      ),
    },
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
      console.log(editFormData);
      setLoadings(true);
      // Dispatch the async thunk action to update the data
      await dispatch(updateAdminCandidateDataAsync(editFormData));
 
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
  const handleInputChange = (field, value) => {
    setShowEditFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setEditFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  return (
    <>
      <Usernav />
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
                onChange={handleFromDateChange}
              />
            </Col>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px", }}
                // inputStyle={{ textAlign: 'center' }} // Align text to center
                placeholder="To Date"
                value={formData.unformatedtoDate ? formData.unformatedtoDate : null}
                onChange={handleToDateChange}
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
                <Option value="Oracle Finance - Domain Trainee">
                  Oracle Finance - Domain Trainee
                  </Option>
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
                // value={formData.interviewerName || undefined}
                onChange={(value) => handleChange("interviewerName", value)}
              >
                {interviewers.map((interviewer) => (
                  <Option key={interviewer.id} value={interviewer.name}>
                    {interviewer.username}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="Interviewer Status"
                value={formData.interviewerStatus || undefined}
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
              {/* <Button
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
              <Button
                style= {{marginLeft : "10px"}}
                type="primary"
                icon={<ArrowDownOutlined />}
                loading={loadings}
                onClick={() => {
                  
                  clearForm1();
                  setShowTable(false); // Set showTable to true when clicking the button
                }}
              >
                Export
              </Button> */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      <Button
        type="primary"
        icon={<SyncOutlined />}
        loading={loadings}
        onClick={() => {
          fetchCandidateDetails();
          clearForm();
          setShowTable(true); // Set showTable to true when clicking the button
        }}
        style={{ width: 'auto', flex: '1 1 auto' }}
      >
        Find
      </Button>
      <Button
        type="primary"
        icon={<SyncOutlined />}
        loading={loadings}
        onClick={() => {
          clearForm1();
          setShowTable(false); // Set showTable to false when clicking the button
        }}
        style={{ marginLeft: '10px', width: 'auto', flex: '1 1 auto' }}
      >
        Clear
      </Button>
      <Button
        type="primary"
        icon={<ArrowDownOutlined />}
        loading={loadings}
        onClick={() => {
          
          exportData(); // Set showTable to false when clicking the button
        }}
        style={{ marginLeft: '10px', width: 'auto', flex: '1 1 auto' }}
      >
        Export
      </Button>
      <style jsx>{`
        @media (max-width: 1280px) {
          button {
            width: 100%;
            flex: none;
          }
        }
      `}</style>
    </div>
            </Col>
          </Row>
        </Space>
      </Card>
      {showTable && (
        <Card
          title="Candidate Details"
          bordered={false}
          // style={{ margin: "70px", overflow: "auto", width: "auto", borderBottom:"1px solid #f0f0fo"}}
          style={{ margin: "70px", overflow: "auto", width: "auto" }}
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
              value={showEditFormData.resumeId}
            // onChange={(e) =>
            //   handleInputChange('resumeId', e.target.value)
            // }
            />
          </Tooltip>
          <Tooltip title="Candidate Name">
            <Input
              placeholder="Candidate Name"
              value={showEditFormData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Tooltip>
          <Tooltip title="Resume Score">
            <Input
              placeholder="Resume Score"
              value={showEditFormData.resumeScore}
              onChange={(e) => handleInputChange('resumeScore', e.target.value)
              }
            />
          </Tooltip>
          <Tooltip title="Experience">
            <Input
              placeholder="Experience"
              value={showEditFormData.yearsOfExperience}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)
              }
            />
          </Tooltip>
          <Tooltip title="Job Role">
            <Select
              style={{ width: "100%" }}
              placeholder="Job Role"
              value={showEditFormData.jobRole}
              onChange={(value) =>
                // setEditFormData({ ...editFormData, jobRole: value })
                handleInputChange('jobRole', value)
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
              value={showEditFormData.assigned}
              onChange={(value) =>
                // setEditFormData({
                //   ...editFormData,
                //   assigned: value,
                // })
                handleInputChange('assigned', value)
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
              value={showEditFormData.shortlistStatus}
              onChange={(value) =>
                // setEditFormData({
                //   ...editFormData,
                //   recruiterSubmissionStatus: value,
                // })
                handleInputChange('shortlistStatus', value)
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
              value={showEditFormData.currentStatus}
              onChange={(value) =>
                // setEditFormData({ ...editFormData, currentStatus: value })
                handleInputChange('currentStatus', value)
              }
            >
              <Option value="NOT_ASSIGNED">NOT ASSIGNED</Option>
              <Option value="ASSIGNED">ASSIGNED</Option>
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
        width={900}
        // width={900}
      >
        <Divider />
        <Table columns={interviewerColumns} dataSource={interviwewerData} scroll={{ x: true }} />
 
 
        <Modal
          title="Skill Details"
          visible={showSkillsModal}
          onCancel={() => { setShowSkillsModal(false) }}
          footer={null}
        >
          <Table columns={skillsColumns} dataSource={skills} scroll={{ x: true }} />
        </Modal>
 
      </Modal>
    </>
  );
};
 
export default AdminSummary;