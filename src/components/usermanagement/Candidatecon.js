import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./hrrcontainer.css";
import BarChartIcon from "@mui/icons-material/BarChart";
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BeenhereIcon from '@mui/icons-material/Beenhere';

const UserCard = ({ user, onClick }) => {
  const getAvatarUrl = () => {
    return process.env.PUBLIC_URL + "./img/avtr3.jpg";
  };

  return (
    <div className="user-card-can" onClick={() => onClick(user)}>
      <img className="avatar" src={getAvatarUrl()} alt="User Avatar" />
      <h3>{user.name}</h3>
          <p style={{ display: 'flex', alignItems: 'center' }}><WorkOutlineIcon style={{ color: "rgb(88, 167, 204)" }} />    <div style={{ paddingLeft: '15px' }}> {user.jobRole}</div></p>
    <p style={{ display: 'flex', alignItems: 'center' }}><BeenhereIcon style={{ color: "rgb(88, 167, 204)" }} /> <div style={{ paddingLeft: '15px' }}> {user.yearsOfExperience} {user.yearsOfExperience === '1' ? "year" : "years"}</div></p>
    <p style={{ display: 'flex', alignItems: 'center' }}><LocalPhoneIcon style={{ color: "rgb(88, 167, 204)" }} />     <div style={{ paddingLeft: '15px' }}> {user.phoneNo}</div></p>

      <div className="score">
        <p>{user.resumeScore}</p>
      </div>
    </div>
  );
};

const UserDetailsModal = ({ user, onClose, onDelete }) => {
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
      <p>Job Role: {user.jobRole}</p>
      <p>Score: {user.resumeScore}</p>
      <p>Verified: {user.Verified}</p>
      <p>Experience: {user.yearsOfExperience}</p>

      <div className="button-container">
        <button onClick={onDelete}>Delete</button>
        <button>Pause</button>
      </div>
      <span>
        <BarChartIcon /> 
        {/*  */}
        Show Analytics
      </span>
    </div>
  );
};

const Candidatecon = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch users from the API using Axios
    const token = localStorage.getItem("accessToken");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/getAllCandidates",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    };

    // Call the fetchUsers function
    fetchUsers();
  }, []); // Empty dependency array means this effect will run only once, similar to componentDidMount

  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleDeleteUser = () => {
    // Implement your delete logic here
    console.log("Deleting user:", selectedUser);
    // Update users state after deletion if needed
    // setUsers(users.filter(user => user.username !== selectedUser.username));
    handleCloseModal();
  };

  const hrrUsers = users;

  return (
    <div className="container">
      {hrrUsers.map((user) => (
        <UserCard key={user.id} user={user} onClick={handleCardClick} />
      ))}

      {selectedUser && (
        <>
          <div className="modal-backdrop" onClick={handleCloseModal}></div>
          <UserDetailsModal
            user={selectedUser}
            onClose={handleCloseModal}
            onDelete={handleDeleteUser}
          />
        </>
      )}
    </div>
  );
};

export default Candidatecon;
