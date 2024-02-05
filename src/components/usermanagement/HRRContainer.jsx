// HRRContainer.jsx

import React, { useState, useEffect, useRef } from 'react';
import userData from '../../user.json'; // Import the JSON data directly
import './hrrcontainer.css'; // Import the CSS file
import BarChartIcon from '@mui/icons-material/BarChart';

const UserCard = ({ user, onClick }) => {
    return (
      <div className="user-card" onClick={() => onClick(user)}>
        <h3>{user.name}</h3>
       
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
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);
  
    return (
      <div className="user-details-modal" ref={modalRef}>
        <h3>{user.name}</h3>
        <p>Role: {user.ROLE}</p>
        <p>New Applicants: {user.NewApplicants}</p>
        <p>Verified: {user.Verified}</p>
        <p>Assigned to tech: {user.AssignedToTech}</p>
        <p>waiting for approval: {user.WaitingForApproval}</p>
        <p>completed: {user.Completed}</p>
        <div className='button-container'>
        <button onClick={onDelete}>Delete</button>
        <button>Pause</button>
        </div>
        <span><BarChartIcon/>Show Analytics</span>
        
      </div>
    );
  };
  
  const HRRContainer = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
  
    useEffect(() => {
      setUsers(userData);
    }, []);
  
    const handleCardClick = (user) => {
      setSelectedUser(user);
    };
  
    const handleCloseModal = () => {
      setSelectedUser(null);
    };
  
    const handleDeleteUser = () => {
      // Implement your delete logic here
      console.log('Deleting user:', selectedUser);
      // Update users state after deletion if needed
      // setUsers(users.filter(user => user.name !== selectedUser.name));
      handleCloseModal();
    };
  
    const hrrUsers = users.filter(user => user.ROLE === 'HRR');
  
    return (
      <div className="container">
        {hrrUsers.map(user => (
          <UserCard
            key={user.name}
            user={user}
            onClick={handleCardClick}
          />
        ))}
  
        {selectedUser && (<>
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
  
  export default HRRContainer;