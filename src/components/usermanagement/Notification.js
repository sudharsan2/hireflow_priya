
 
import React, { useState, useEffect } from 'react';
import './Notification.css';
import axios from 'axios';
 
 
 
const NotificationComponent = ({ candidate, isVisible }) => {
  return isVisible ? (
    <tr>
      {Object.values(candidate).map((value, index) => (
        <td key={index}>{value || "null"}</td>
      ))}
    </tr>
  ) : null;
};
 
export const Notification = () => {
  const [candidates, setCandidates] = useState([]);
 
  useEffect(() => {
    const fetchNotificationData = async () => {
      try {
        const api = "http://172.235.10.116:7000/hiring/auth/notificationforadmin"
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(api,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log(response.data);
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching notification data:', error);
      }
    };
    fetchNotificationData();
  }, []);
 
  const handleClear = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://172.235.10.116:7000/hiring/auth/clearnotification',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log('Notifications cleared successfully:', response.data);
      setCandidates([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
    
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
        {candidates.length > 0 ? (
          <tbody>
            {candidates.map((candidate, index) => (
              <NotificationComponent key={index} candidate={candidate} isVisible={true} />
            ))}
            <button className="clear-button" onClick={handleClear}>Clear</button>
          </tbody>
        ) : (
          <h2>No Notifications</h2>
        )}
      </table>
    </div>
  );
};
 