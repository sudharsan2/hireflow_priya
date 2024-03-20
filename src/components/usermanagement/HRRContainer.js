import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./hrrcontainer.css";
import BarChartIcon from "@mui/icons-material/BarChart";

const UserCard = ({ user, onClick }) => {
  const getAvatarUrl = () => {
    return process.env.PUBLIC_URL + "./img/avtr1.jpg";
  };

  return (
    <div className="user-card-hrr" onClick={() => onClick(user)}>

      <h3>{user.username}</h3>
      <img className="avatar" src={getAvatarUrl()} alt="User Avatar" />
      <div>
        <p>{user.empId}</p>
      </div>
      <p>completed: 0</p>
    </div>
  );
};

const UserDetailsModal = ({ user, onClose, onDelete, onPause, hRCount, handleCount}) => {
  const isPaused = user.pause;
  // const [isPaused, setIsPaused]=useState(user.pause);
  handleCount();
  console.log(hRCount);
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
      <p>Role: {user.roles}</p>
      <p>New Applicants: {hRCount.newApplicants}</p>
      <p>Assigned to tech: {hRCount.assignedToTech}</p>
      <p>waiting for approval: {hRCount.waitingForApproval}</p>
      <p>completed: {hRCount.completed}</p>
      <div className="button-container">
        <button onClick={onDelete} >Delete</button>
        <button onClick={onPause}>{isPaused ? 'Unpause' : 'Pause'}</button>
      </div>

    </div>
  );
};


const HRRContainer = () => {
  const [users, setUsers] = useState([]);
  const [hrCount, setHrCount] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch users from the API using Axios
    const token = localStorage.getItem("accessToken");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://172.235.10.116:7000/hiring/auth/getAllUsers",
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

  const handleDeleteUser = async () => {
    const is_active = selectedUser.is_active
    const id = selectedUser.id;
    try {
      const response = await axios.put(`http://172.235.10.116:7000/hiring/auth/activeInactiveUser/${id}`, {
        is_active: !is_active
      });
      const token = localStorage.getItem("accessToken");
      const response1 = await axios.get(
        "http://172.235.10.116:7000/hiring/auth/getAllUsers",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setUsers(response1.data);
    } catch (error) {
      console.error("Error pausing user:", error.response.data);
    }
    handleCloseModal();

  };

  const handlePauseUser = async () => {
    const id = selectedUser.id;
    const isPause = selectedUser.pause;
    try {
      const response = await axios.put(`http://172.235.10.116:7000/hiring/auth/pauseResumeUser/${id}`, {
        pause: !isPause
      });
      const token = localStorage.getItem("accessToken");
      const response1 = await axios.get(
        "http://172.235.10.116:7000/hiring/auth/getAllUsers",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setUsers(response1.data);

    } catch (error) {
      console.error("Error pausing user:", error.response.data);
    }
    handleCloseModal();
  };

  const handleCountHrUser = async () => {
    const empId = selectedUser.empId;
    try {
      const response = await axios.get(
        `http://172.235.10.116:7000/hiring/auth/statsofhr/${empId}`,
      );
      setHrCount(response.data);
    }
    catch (error) {

    }
    
  }

  const hrrUsers = users.filter((user) => user.roles === 2);

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
            onPause={handlePauseUser}
            hRCount={hrCount}
            handleCount={handleCountHrUser}
          />
        </>
      )}
    </div>
  );
};

export default HRRContainer;
