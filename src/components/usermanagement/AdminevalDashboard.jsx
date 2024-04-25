import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Input, Form, Table } from "antd";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import axios from "axios";

const { TextArea } = Input;

const Adminevaldashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [finalRemarks, setFinalRemarks] = useState("");

  useEffect(() => {
    getFinalCandidates();
  }, []);

  const getFinalCandidates = async () => {
    axios.get("https://hireflowapi.focusrtech.com:90/hiring/auth/getallcadidatesforevaluation")
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error("Error fetching candidates data:", error);
      });
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Job Role',
      dataIndex: 'jobRole',
      key: 'jobRole',
    },
    {
      title: 'Years of Experience',
      dataIndex: 'yearsOfExperience',
      key: 'yearsOfExperience',
    },
    {
      title: 'Phone No',
      dataIndex: 'phoneNo',
      key: 'phoneNo',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleModalOpen(record)}>View Details</Button>
      ),
    },
  ];

  const handleModalOpen = (user) => {
    axios.get(`https://hireflowapi.focusrtech.com:90/hiring/auth/getallcadidatesforevalutaionbyid/${user.resumeId}`)
      .then(response => {
        setUserData(response.data);
        setModalVisible(true);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = (status) => {
    console.log("Form values:", { ...userData.candidateData, finalRemarks });

    // Call the API
    axios.post("https://hireflowapi.focusrtech.com:90/hiring/auth/selectcandidatesstatus", {
      resumeId: userData.candidateData.resumeId,
      currentStatus: status
    })
      .then(response => {
        console.log("API response:", response.data);
        getFinalCandidates();
      })
      .catch(error => {
        console.error("Error calling API:", error);
      });


    setModalVisible(false);
  };

  return (
    <div>
      <div className="container">
      <div className="header">
                    <h2>Admin Evaluation</h2>
                    </div>
        <Table columns={columns} dataSource={candidates} />

      </div>
      <Modal
        title="User Details"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {userData && (
          <div style={{
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "1fr"
          }} >
            <Typography.Text>Experience : {userData.candidateData.yearsOfExperience}</Typography.Text>
            <Typography.Text>Role : {userData.candidateData.jobRole}</Typography.Text>
            <Typography.Text>Resume Score : {userData.candidateData.resumeScore}</Typography.Text>
            <Typography.Text>Candidate Name : {userData.candidateData.name}</Typography.Text>
            <Typography.Text>Feedback : {userData.candidateData.hrFeedback}</Typography.Text>
            <Typography.Text>Overall Rating : {userData.candidateData.overall_rating}</Typography.Text>
            <Form.Item label="Final Remarks">
              <Input value={finalRemarks} onChange={(e) => setFinalRemarks(e.target.value)} />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "20%", paddingRight: "20%" }}>
              <Button type="primary" onClick={() => handleFormSubmit("SELECTED")}>
                Select
              </Button>
              <Button type="primary" onClick={() => handleFormSubmit("ON_HOLD")}>
                On Hold
              </Button>
              <Button type="primary" onClick={() => handleFormSubmit("REJECTED")}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Adminevaldashboard;
