// Navbar.js

import React, { useState } from 'react';
import './usernav.css';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const Usernav = ({ onAddUser}) => {

    const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({
      ROLE: '',
      name: '',
      NewApplicants: 0,
      Verified: 0,
      AssignedToTech: 0,
      WaitingForApproval: 0,
      Completed: 0,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    };
  
    const handleAddUserClick = () => {
      setAddUserModalOpen(true);
    };
  
    const handleCloseAddUserModal = () => {
      setAddUserModalOpen(false);
    };
  
    const handleAddUser = () => {
      onAddUser(newUser);
      setNewUser({
        ROLE: '',
        name: '',
        NewApplicants: 0,
        Verified: 0,
        AssignedToTech: 0,
        WaitingForApproval: 0,
        Completed: 0,
      });
      handleCloseAddUserModal();
    };
  

    const imgurl1= process.env.PUBLIC_URL + './img/icon1.png';
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={imgurl1} alt="Logo" className="logo" />
      </div>
      <div className="navbar-right">
      <span  onClick={handleAddUserClick} className="nav-span">
    <PersonAddAlt1Icon style={{ marginRight: '5px' }} />Add user

  </span>
        <span className="nav-span">Candidate</span>
        <span className="nav-span">Logout</span>
        {isAddUserModalOpen && (
        <>
          <div className="modal-backdrop" onClick={handleCloseAddUserModal}></div>
          <div className="add-user-modal">
            
           
              
              <input type="text" name="ROLE" value={newUser.ROLE} onChange={handleChange} placeholder='Enter the role' />
            
            
              
              <input type="text" name="name" value={newUser.name} onChange={handleChange} placeholder='Enter the name' />
              <input type="text" name="Empid" value={newUser.Empid} onChange={handleChange} placeholder='Enter the Empid' />
              <input type="text" name="Username" value={newUser.Empid} onChange={handleChange} placeholder='Enter the Username' />
              <input type="text" name="Password" value={newUser.Empid} onChange={handleChange} placeholder='Enter the password' />
              
            
            
            <div className='button-container'>
            <button type='submit' onClick={handleAddUser}>Add User</button>
            <button type='submit' onClick={handleCloseAddUserModal}>Cancel</button>
            </div>
          </div>
        </>
      )}
      </div>
    </nav>
  );
};

export default Usernav;
