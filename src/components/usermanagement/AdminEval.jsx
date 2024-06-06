import React, { useState, useEffect } from "react";
import { Modal, Typography, Button, Input, Form } from "antd";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from "axios";

const { TextArea } = Input;

const CanCard = ({ user, onModalOpen }) => {
  const getAvatarUrl = () => {
    return process.env.PUBLIC_URL + "./img/avtr1.jpg";
  };

  return (
    <div className={user.currentStatus === 'ON_HOLD' ? "user-card-can" : "user-card-can"} style={{ cursor: "pointer" }} onClick={() => onModalOpen(user)}>

       {/* <img className="avatar" src={getAvatarUrl()} alt="User Avatar" /> */}
      <h3>{user.name}</h3>
      <p style={{ display: 'flex', alignItems: 'center' }}><WorkOutlineIcon style={{ color: "rgb(88, 167, 204)" }} />    <div style={{ paddingLeft: '15px' }}> {user.jobRole}</div></p>
    <p style={{ display: 'flex', alignItems: 'center' }}><BeenhereIcon style={{ color: "rgb(88, 167, 204)" }} /> <div style={{ paddingLeft: '15px' }}> {user.yearsOfExperience} {user.yearsOfExperience === '1' ? "year" : "years"}</div></p>
    <p style={{ display: 'flex', alignItems: 'center' }}><LocalPhoneIcon style={{ color: "rgb(88, 167, 204)" }} />     <div style={{ paddingLeft: '15px' }}> {user.phoneNo}</div></p>
    <p style={{ display: 'flex', alignItems: 'center'}} > <FiberManualRecordIcon  style={{ color: user.currentStatus === 'ON_HOLD' ? '#ffda22': ' #22c4ff' }} /><div style={{ paddingLeft: '10px' }}>{user.currentStatus==='ON_HOLD'? 'On Hold':'Pending'}</div></p>
    {/* <FiberManualRecordIcon  style={{ color: user.currentStatus === 'ON_HOLD' ? '#ffda22': '#17c453' }} /> */}
    </div>
  );
};

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [finalremarks, setFinalRemarks] = useState("");

useEffect(() => {
  // Check if userData is not null before setting finalRemarks
  if (userData && userData.candidateData) {
    setFinalRemarks(userData.candidateData.finalRemarks);
  }
}, [userData]);

  const [searchValue, setSearchValue] = useState("");

  useEffect(()=>{
    getFinalCandidates();
  },[]);

  const getFinalCandidates=async()=>{
    axios.get("https://hireflowapidev.focusrtech.com:90/hiring/auth/getallcadidatesforevaluation")
    .then(response => {
      setCandidates(response.data);
    })
    .catch(error => {
      console.error("Error fetching candidates data:", error);
    });
  }

  const handleModalOpen = (user) => {

    axios.get(`https://hireflowapidev.focusrtech.com:90/hiring/auth/getallcadidatesforevalutaionbyid/${user.resumeId}`)
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
    console.log("Form values:", { ...userData.candidateData, finalRemarks: finalremarks });
  
    // Call the API
    axios.post("https://hireflowapidev.focusrtech.com:90/hiring/auth/selectcandidatesstatus", {
      resumeId: userData.candidateData.resumeId,
      currentStatus: status,
      finalRemarks: finalremarks // Use finalremarks state variable here
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
  

  const filteredCandidates = candidates.filter(candidate => {
    const searchTerms = Object.values(candidate).join(" ").toLowerCase();
    return searchTerms.includes(searchValue.toLowerCase());
  });

  return (
    <div>
      <Input.Search
        style={{ width: '35%',margin:'15px', position: 'absolute', top: '7%', right: '2%', height:'1%' }}
        placeholder="Search..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div style={{marginTop:'5%'}}>
      <div className="container">
        {filteredCandidates.length > 0 ? filteredCandidates.map((user, index) => (
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
            <Typography.Text>Feedback : {userData.candidateData.hrFeedback}</Typography.Text>
            <Typography.Text>Overall Rating : {userData.candidateData.overall_rating}</Typography.Text>
            <Form.Item label="Final Remarks">
              <Input value={finalremarks} onChange={(e) => setFinalRemarks(e.target.value)} />
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
    </div>
  );
};

export default App;
