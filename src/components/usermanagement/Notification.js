

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

export const Notification = ({ onClearNotification }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
  
    const fetchNotificationData = async () => {
      try {
        const api = "https://hireflowapidev.focusrtech.com:90/hiring/auth/notificationforadmin"
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
    const fetchRecruiterNotification = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const api = "https://hireflowapidev.focusrtech.com:90/hiring/interviewer/notshortlistedNotification"
        
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
    const fetchInterviewerNotification = async () => {
      try {
        const api = "https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/getMeetingNotification"
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
    // localStorage.getItem('role')=='ROLE_RECRUITER'?fetchRecruiterNotification():fetchNotificationData()
    if (localStorage.getItem('role') == 'ROLE_RECRUITER') {
      fetchRecruiterNotification();
    }
    else if (localStorage.getItem('role') == 'ROLE_ADMIN') {
      fetchNotificationData();
    }
    else {
      fetchInterviewerNotification();
    }

  }, []);

  const handleClear = async () => {
    if (localStorage.getItem('role') == 'ROLE_ADMIN') {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          'https://hireflowapidev.focusrtech.com:90/hiring/auth/clearnotification',
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log('Notifications cleared successfully:', response.data);
        setCandidates([]);
        onClearNotification();
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    }
    else if (localStorage.getItem('role') == 'ROLE_RECRUITER') {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          'https://hireflowapidev.focusrtech.com:90/hiring/interviewer/clearNotification',
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log('Notifications cleared successfully:', response.data);
        setCandidates([]);
        onClearNotification();
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    }
    else {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          'https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/clearNotification',
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log('Notifications cleared successfully:', response.data);
        setCandidates([]);
        onClearNotification();
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    }
    


  };

  return (
    <div className='notification-table-container'>
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
