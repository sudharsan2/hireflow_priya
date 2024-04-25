// HRRContainer.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import "./hrrcontainer.css"; // Import the CSS file
import BarChartIcon from "@mui/icons-material/BarChart";
import axios from "axios";

const UserCard = ({ user, onClick, hrCount }) => {
  const getAvatarUrl = () => {
    return process.env.PUBLIC_URL + "/img/avtr2.jpg";
  };

  return (
    <div className="user-card-tech" onClick={() => onClick(user)}>
      <img className="avatar" src={getAvatarUrl()} alt="User Avatar" />
      <h3>{user.username}</h3>
      <p>{user.empId}</p>
      {/* <p>completed: {hrCount.completed}</p> */}
    </div>
  );
};

const Techcontainer = ({ users, fetchData }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [hrCount, setHrCount] = useState({});

  const handleCountHrUser = async (selectedUser) => {
    const empId = selectedUser.empId;

    try {
      const response = await axios.get(
        `https://hireflowapi.focusrtech.com:90/hiring/auth/statsofinterviewer/${empId}`
      );
      setHrCount(response.data);
    } catch (error) {
      console.error("Error counting HR user:", error);
    }
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
    handleCountHrUser(user);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    const is_active = selectedUser.is_active;
    const id = selectedUser.id;
    try {
      await axios.put(
        `https://hireflowapi.focusrtech.com:90/hiring/auth/activeInactiveUser/${id}`,
        {
          is_active: !is_active,
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error pausing user:", error.response.data);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const hrrUsers = users.filter((user) => user.roles === 3);

  return (
    <>
      <div className="header">
        <h2>Technical Interviewer</h2>
      </div>
      <div className="container">
        {hrrUsers.map((user) => (
          <UserCard key={user.id} user={user} onClick={handleCardClick} hrCount={hrCount} />
        ))}

        <Modal
          title="Role Interviewer"
          visible={selectedUser !== null}
          onCancel={handleCloseModal}
          width={'20%'}
          footer={[
            <Button type='primary' key="delete" onClick={handleDeleteUser}>
              Delete
            </Button>,
            
          ]}
        >
          {hrCount && (
            <>
              <p>New Applicants: {hrCount.assignedCandidates}</p>
              <p>completed: {hrCount.completed}</p>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Techcontainer;
