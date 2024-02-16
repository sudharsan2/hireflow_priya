// HRRHeader.jsx

import React, { useState } from 'react';
import './header.css'; // Import the CSS file for styling
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const Infocon = ({ onAddUser, onAssign }) => {
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



  return (
    <div className="header">
  
  <span onClick={onAssign} className="assign-text">
    Waiting:
  </span>
  <span onClick={onAssign} className="assign-text">
    Assigned:
  </span>


    </div>
  );
};

export default Infocon;
