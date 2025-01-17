// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./hrrcontainer.css";
// import BarChartIcon from "@mui/icons-material/BarChart";
// import { Modal, Button } from 'antd';

// const UserCard = ({ user, onClick, hrCount}) => {
//   const getAvatarUrl = () => {
//     return process.env.PUBLIC_URL + "/img/avtr1.jpg";
//   };

//   return (
//     <div className="user-card-hrr" onClick={() => onClick(user)}>
//       <h3>{user.username}</h3>
//       <img className="avatar" src={getAvatarUrl()} alt="User Avatar" />
//       <div>
//         <p>{user.empId}</p>
//       </div>
//       {/* <p>{user.email}</p> */}
//     </div>
//   );
// };

// const UserDetailsModal = ({ user, onClose, onDelete, onPause, hrCount }) => {
//   const isPaused = user.pause;
//   const modalRef = useRef(null);

//   const handleClickOutside = (event) => {
//     if (modalRef.current && !modalRef.current.contains(event.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   return (
//     <div className="user-details-modal" ref={modalRef}>
//       <h3>{user.name}</h3>
//       {/* <p>Role: {user.roles}</p> */}
//       <p><strong><u>Role Recruiter</u></strong></p>
//       <p>New Applicants: {hrCount.newApplicants}</p>
//       <p>Assigned to tech: {hrCount.assignedToTech}</p>
//       <p>Waiting for approval: {hrCount.waitingForApproval}</p>
//       <p>Completed: {hrCount.completed}</p>
//       <div className="button-container">
//         <button onClick={onDelete}>Delete</button>
//         <button onClick={onPause}>{isPaused ? 'Unpause' : 'Pause'}</button>
//       </div>
//     </div>
//   );
// };

// const HRRContainer = ({users1, fetchData}) => {
  
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [hrCount, setHrCount] = useState({});

  

//   const handleCardClick = (user) => {
//     setSelectedUser(user);
//     handleCountHrUser(user.empId);
//   };

//   const handleCloseModal = () => {
//     setSelectedUser(null);
//   };

//   const handleDeleteUser = async () => {
//     const isActive = selectedUser.is_active;
//     const id = selectedUser.id;
//     try {
//       await axios.put(`https://hireflowapidev.focusrtech.com:90/hiring/auth/activeInactiveUser/${id}`, {
//         is_active: !isActive
//       });
//       fetchData();
//     } catch (error) {
//       console.error("Error deleting user:", error.response.data);
//     }
//     handleCloseModal();
//   };

//   const handlePauseUser = async () => {
//     const id = selectedUser.id;
//     const isPause = selectedUser.pause;
//     try {
//       await axios.put(`https://hireflowapidev.focusrtech.com:90/hiring/auth/pauseResumeUser/${id}`, {
//         pause: !isPause
//       });
//       fetchData();
//     } catch (error) {
//       console.error("Error pausing user:", error.response.data);
//     }
//     handleCloseModal();
//   };

//   const handleCountHrUser = async (empId) => {
//     try {
//       const response = await axios.get(`https://hireflowapidev.focusrtech.com:90/hiring/auth/statsofhr/${empId}`);
//       setHrCount(response.data);
//     } catch (error) {
//       console.error("Error fetching HR count:", error.message);
//     }
//   };

//   const hrrUsers = users1.filter((user) => user.roles === 2);

//   return (
//     <div className="container">
//       {hrrUsers.map((user) => (
//         <UserCard key={user.id} user={user} onClick={handleCardClick} hrCount={hrCount}/>
//       ))}

// <Modal
//       title="User Details"
//       visible={!!selectedUser}
//       onCancel={handleCloseModal}
//       footer={null}
//       width={'20%'}
//     >
//       {selectedUser && (
//         <div>
//         <p>Name:   {selectedUser.username}</p>
//         <p>Email:   {selectedUser.email}</p>
//         <p>Emp ID:   {selectedUser.empId}</p>
//         <p>New applicants:  {hrCount.newApplicants}</p>
//         <p>Assigned To Tech:   {hrCount.assignedToTech}</p>
//         <p>Waiting For Approval:   {hrCount.waitingForApproval}</p>
//         <p>Completed:   {hrCount.completed}</p>
//         {/* Add more details as needed */}
//         <div style={{display:'flex',justifyContent:'space-between'}}>
//           <Button type='primary' onClick={() => handleDeleteUser(selectedUser)}>Delete</Button>
//           <Button type='primary' onClick={() => handleDeleteUser(selectedUser)}>Edit</Button>
//           <Button type='primary' onClick={() => handlePauseUser(selectedUser)}>
//             {selectedUser.pause ? 'Unpause' : 'Pause'}
//           </Button>
//         </div>
//       </div>
//       )}
//     </Modal>
//     </div>
//   );
// };

// export default HRRContainer;


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./hrrcontainer.css";
import { Modal, Button, Input } from 'antd';

const UserCard = ({ user, onClick }) => {
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
    </div>
  );
};

const HRRContainer = ({ users1, fetchData }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [hrCount, setHrCount] = useState({});
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editUser, setEditUser] = useState({ name: '', email: '', empId: '' });

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
      await axios.put(`https://hireflowapidev.focusrtech.com:90/hiring/auth/activeInactiveUser/${id}`, {
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
      await axios.put(`https://hireflowapidev.focusrtech.com:90/hiring/auth/pauseResumeUser/${id}`, {
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
      const response = await axios.get(`https://hireflowapidev.focusrtech.com:90/hiring/auth/statsofhr/${empId}`);
      setHrCount(response.data);
    } catch (error) {
      console.error("Error fetching HR count:", error.message);
    }
  };

  const handleEditUser = () => {
    setEditUser({
      name: selectedUser.username,
      email: selectedUser.email,
      empId: selectedUser.empId
    });
    setIsEditModalVisible(true);
  };

  const handleEditSave = async () => {
    const id = selectedUser.id;
    try {
      await axios.post(`https://hireflowapidev.focusrtech.com:90/hiring/auth/updateUser/${id}/`, {
       
        username: editUser.name,
        email: editUser.email,
        empId: editUser.empId
      });
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error.response.data);
    }
    setIsEditModalVisible(false);
    handleCloseModal();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const hrrUsers = users1.filter((user) => user.roles === 2);

  return (
    <div className="container">
      {hrrUsers.map((user) => (
        <UserCard key={user.id} user={user} onClick={handleCardClick} />
      ))}

      <Modal
        title="User Details"
        visible={!!selectedUser}
        onCancel={handleCloseModal}
        footer={null}
        width={'20%'}
      >
        {selectedUser && (
          <div>
            <p>Name: {selectedUser.username}</p>
            <p>Email: {selectedUser.email}</p>
            <p>Emp ID: {selectedUser.empId}</p>
            <p>New applicants: {hrCount.newApplicants}</p>
            <p>Assigned To Tech: {hrCount.assignedToTech}</p>
            <p>Waiting For Approval: {hrCount.waitingForApproval}</p>
            <p>Completed: {hrCount.completed}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type='primary' onClick={handleDeleteUser}>Delete</Button>
              <Button type='primary' onClick={handleEditUser}>Edit</Button>
              <Button type='primary' onClick={handlePauseUser}>
                {selectedUser.pause ? 'Unpause' : 'Pause'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit User Details"
        visible={isEditModalVisible}
        onCancel={handleEditCancel}
        onOk={handleEditSave}
        width={'20%'}
      >
        <div>
          <label>Name:</label>
          <Input
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
          />
          <label>Email:</label>
          <Input
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
          />
          <label>Emp ID:</label>
          <Input
            value={editUser.empId}
            onChange={(e) => setEditUser({ ...editUser, empId: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
};

export default HRRContainer;

