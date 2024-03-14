import React, { useEffect, useState } from "react";
import Cannav from "../../components/usermanagement/Cannav";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
} from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCandidateDetailsAsync,
  fetchListofInterviewerAsync,
  fetchListofRecruiterAsync,
  fetchListofSourceAsync,
  updateCandidateDataAsync,
  setErrorMessage,
} from "../../redux/slices/summarySlice";

////////////////////////////////////////////////////////////

const { Option } = Select;

const AdminSummary = () => {
  const [loadings, setLoadings] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const dispatch = useDispatch();
  const interviewers = useSelector((state) => state.summary.interviewers);
  const recruiters = useSelector((state) => state.summary.recruiters);
  const source = useSelector((state) => state.summary.source);
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

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
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
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
    // Add more columns as needed
  ];

  const clearForm = () => {
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
  return (
    <>
      <Cannav />
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
                  <Option key={src.id} value={src.name}>
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
              />
            </Col>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px" }}
                placeholder="To Date"
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
                <Option value="NOT_SHORTLISTED">NOT SHORTLISTED</Option>
                <Option value="HOLD">HOLD</Option>
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px" }}
                placeholder="Recruiter Date"
                value={formData.recruiterDate}
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
                <Option value="NOT_SHORTLISTED">NOT SHORTLISTED</Option>
                {/* Add more options as needed */}
              </Select>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <DatePicker
                style={{ width: "100%", height: "32px" }}
                placeholder="Interviewer Date"
                value={formData.interviewerDate}
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
            </Col>
          </Row>
        </Space>
      </Card>
      {showTable && (
        <Card
          title="Candidate Details"
          bordered={false}
          style={{ margin: "70px" }}
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
              <Option value="NOT_SHORTLISTED">NOT SHORTLISTED</Option>
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
    </>
  );
};

export default AdminSummary;
