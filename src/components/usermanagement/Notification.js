
import React, { useState, useEffect } from 'react';
import './Notification.css';
import axios from 'axios';
 
const NotificationComponent = ({ candidate, onDelete }) => {
  const [isVisible] = useState(true);
 
  return isVisible ? (
    <tr>
      {Object.values(candidate).map((value, index) => (
        <td key={index }>{value|| "null"}</td>
      ))}
    </tr>
  ) : null;
};
 
export const Notification = () => {
  const [candidates, setCandidates] = useState([]);
 
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.235.10.116:7000/hiring/auth/notificationforadmin',{
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
        console.log(response.data);
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching notification data:', error);
      }
    };
    fetchData();
  }, []);
 
  const handleClear = () => {
    setCandidates([]);
  };
 
  return (
    <div>
      <table className="notification-table">
        <thead>
          <tr>
            {Object.keys(candidates[0] || {}).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
          </tr>
        </thead>
        {candidates.length > 0 ? <tbody>
          {candidates.map((candidate, index) => (
            <NotificationComponent key={index} candidate={candidate} />
          ))}
          <button className="clear-button" onClick={handleClear}>Clear</button>
        </tbody> : <h2>No Notifications</h2>}
       
      </table>
     
    </div>
  );
};
 