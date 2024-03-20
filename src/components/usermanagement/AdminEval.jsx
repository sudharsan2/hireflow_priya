import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Input, Form } from "antd";
import axios from "axios";

const { TextArea } = Input;

const CanCard = ({ user, onModalOpen }) => {
  const getAvatarUrl = () => {
    return process.env.PUBLIC_URL + "./img/avtr1.jpg";
  };

  return (
    <div className="user-card-can" style={{ cursor: "pointer" }} onClick={() => onModalOpen(user)}>
      <img className="avatar" src={getAvatarUrl()} alt="User Avatar" />
      <h3>{user.name}</h3>
      <p>Job Role: {user.jobRole}</p>
      <p>Resume Score: {user.resumeScore}</p>
    </div>
  );
};

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [finalRemarks, setFinalRemarks] = useState("");

  useEffect(() => {

    axios.get("http://172.235.10.116:7000/hiring/auth/getallcadidatesforevaluation")
      .then(response => {
        setCandidates(response.data);
      })
      .catch(error => {
        console.error("Error fetching candidates data:", error);
      });
  }, []);

  const handleModalOpen = (user) => {

    axios.get(`http://172.235.10.116:7000/hiring/auth/getallcadidatesforevalutaionbyid/${user.resumeId}`)
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
    axios.post("http://172.235.10.116:7000/hiring/auth/selectcandidatesstatus", {
      resumeId: userData.candidateData.resumeId,
      currentStatus: status
    })
      .then(response => {
        console.log("API response:", response.data);
      })
      .catch(error => {
        console.error("Error calling API:", error);
      });


    setModalVisible(false);
  };

  return (
    <div>
      <div className="container">
        {candidates.length > 0 ? candidates.map((user, index) => (
          <CanCard key={user.id} user={user} onModalOpen={handleModalOpen} />
        )) : <div style={{ marginLeft:'250px',marginTop:'50px', color:'#808c83'}}><h1>No candidates for Evaluation</h1></div>}

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
            <Typography.Text>Feedback : {userData.candidateData.skills}</Typography.Text>
            <Typography.Text>Overall Rating : {userData.interviewerData.overall_rating}</Typography.Text>
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

export default App;
