

import React, { useEffect, useState } from "react";
import './NewCandidateCards.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import { message } from 'antd';


const ProfileCard = ({ profile }) => {
    const handleDownload = async () => {
  console.log(profile.resumeId);
  const resumeId = profile.resumeId;
  try {
    const response = await axios.get(`https://hireflowapi.focusrtech.com:90/hiring/auth/downloadResume/${resumeId}`, {
      responseType: 'blob',
    });
    console.log(response.headers);
    // const match = /filename="([^"]+)"/.exec(disposition);
 
    const blob = new Blob([response.data], { type: 'application/pdf' });
 
    const url = window.URL.createObjectURL(blob);
 
    window.open(url, '_blank'); // Open PDF in a new tab/window
 
    // Clean up
    window.URL.revokeObjectURL(url);
  } catch (error) {
    message.error('File not found!');
    console.error('Error downloading file:', error);
  }
};
    return (
        <div className="profile-card">
            <AccountCircleIcon className="profile-icon" />
            <h2>{profile.name || 'null'}</h2>
            <p>Experience: {profile.yearsOfExperience} years</p>
            <p>Job Role: {profile.jobRole || 'null'}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>AI Score: {profile.resumeScore || 'null'}</p>
                <DownloadOutlined style={{ fontSize: '25px', cursor: 'pointer', color: 'rgb(0,33,64)' }} onClick={handleDownload} />
            </div>

        </div>
    );
};

export const Candidatecards = ({ selectedFilters, candidateCards }) => {
    const [profileData, setProfileData] = useState([]);

    // useEffect(() => {
    //     const token = localStorage.getItem('accessToken');

    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('https://hireflowapi.focusrtech.com:90/hiring/entryLevel/getAllCandidates', {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 }
    //             });
    //             // Extracting only required fields from the response and handling null values
    //             const extractedData = response.data.map(profile => ({
    //                 name: profile.name || 'null',
    //                 experience: profile.experience || 'null',
    //                 jobRole: profile.jobRole || 'null',
    //                 aiScore: profile.resumeScore || 'null'
    //             }));
    //             console.log(response.data)
    //             setProfileData(extractedData);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     if (token) {
    //         fetchData();
    //     } else {
    //         console.error('Access token not found in localStorage.');
    //     }
    // }, []);


    let filteredData = [...candidateCards];
    console.log(filteredData);
    selectedFilters.forEach(filter => {
        if (filter === "AI Score Ascending") {
            filteredData.sort((a, b) => a.resumeScore - b.resumeScore);
        } else if (filter === "AI Score Descending") {
            filteredData.sort((a, b) => b.resumeScore - a.resumeScore);
        } else if (filter === "Experience Ascending") {
            filteredData.sort((a, b) => a.yearsOfExperience - b.yearsOfExperience);
        } else if (filter === "Experience Descending") {
            filteredData.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
        } else if (filter === "Job Role Ascending") {
            filteredData.sort((a, b) => (a.jobRole || '').localeCompare(b.jobRole || ''));
        } else if (filter === "Job Role Descending") {
            filteredData.sort((a, b) => (b.jobRole || '').localeCompare(a.jobRole || ''));
        }
    });

    return (
        <>
            <div style={{ backgroundColor: "transparent" }}>
                <center>
                    <h2 style={{ color: "rgb(0, 33, 64)" }}>List Of Candidates</h2><br></br>
                </center>
                {filteredData.length > 0 ? <div className="profile-card-container">
                    {filteredData.map((profile, index) => (
                        <ProfileCard key={index} profile={profile} />
                    ))}
                </div> : <center><h2 className="profile-card-container">No New Candidates</h2></center>
                }

            </div>
        </>
    );
};
