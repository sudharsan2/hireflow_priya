import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./hrrcontainer.css";
import BarChartIcon from "@mui/icons-material/BarChart";

const UserCard = ({ user, onClick, hrCount}) => {
  const getAvatarUrl = () => {
    return process.env.PUBLIC_URL + "/img/avtr1.jpg";
  };

  return (
    <div className="user-card-hrr" onClick={() => onClick(user)}>
      <h3>{user.username}</h3>
      <img className="avatar" src={getAvatarUrl()} alt="User Avatar" />
      <div>
        <p>{user.empId}</p>
      </div>
      {/* <p>{user.email}</p> */}
    </div>
  );
};

const UserDetailsModal = ({ user, onClose, onDelete, onPause, hrCount }) => {
  const isPaused = user.pause;
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="user-details-modal" ref={modalRef}>
      <h3>{user.name}</h3>
      {/* <p>Role: {user.roles}</p> */}
      <p><strong><u>Role Recruiter</u></strong></p>
      <p>New Applicants: {hrCount.newApplicants}</p>
      <p>Assigned to tech: {hrCount.assignedToTech}</p>
      <p>Waiting for approval: {hrCount.waitingForApproval}</p>
      <p>Completed: {hrCount.completed}</p>
      <div className="button-container">
        <button onClick={onDelete}>Delete</button>
        <button onClick={onPause}>{isPaused ? 'Unpause' : 'Pause'}</button>
      </div>
    </div>
  );
};

const HRRContainer = ({users1, fetchData}) => {
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [hrCount, setHrCount] = useState({});

  

  const handleCardClick = (user) => {
    setSelectedUser(user);
    handleCountHrUser(user.empId);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    const isActive = selectedUser.is_active;
    const id = selectedUser.id;
    try {
      await axios.put(`http://172.235.10.116:7000/hiring/auth/activeInactiveUser/${id}`, {
        is_active: !isActive
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting user:", error.response.data);
    }
    handleCloseModal();
  };

  const handlePauseUser = async () => {
    const id = selectedUser.id;
    const isPause = selectedUser.pause;
    try {
      await axios.put(`http://172.235.10.116:7000/hiring/auth/pauseResumeUser/${id}`, {
        pause: !isPause
      });
      fetchData();
    } catch (error) {
      console.error("Error pausing user:", error.response.data);
    }
    handleCloseModal();
  };

  const handleCountHrUser = async (empId) => {
    try {
      const response = await axios.get(`http://172.235.10.116:7000/hiring/auth/statsofhr/${empId}`);
      setHrCount(response.data);
    } catch (error) {
      console.error("Error fetching HR count:", error.message);
    }
  };

  const hrrUsers = users1.filter((user) => user.roles === 2);

  return (
    <div className="container">
      {hrrUsers.map((user) => (
        <UserCard key={user.id} user={user} onClick={handleCardClick} hrCount={hrCount}/>
      ))}

      {selectedUser && (
        <>
          <div className="modal-backdrop" onClick={handleCloseModal}></div>
          <UserDetailsModal
            user={selectedUser}
            onClose={handleCloseModal}
            onDelete={handleDeleteUser}
            onPause={handlePauseUser}
            hrCount={hrCount}
          />
        </>
      )}
    </div>
  );
};

export default HRRContainer;
