// HRRHeader.jsx

import React, { useState } from 'react';
import './header.css'; // Import the CSS file for styling
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const HRRHeader = ({ onAddUser, onAssign }) => {
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
  <h2>HRR</h2>
  
  <span onClick={onAssign} className="assign-text">
    Assign
  </span>


    </div>
  );
};

export default HRRHeader;
