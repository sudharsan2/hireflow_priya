
import React, { useEffect, useState } from "react";
import './NewCandidateCards.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
 
const ProfileCard = ({ profile }) => {
    return (
        <div className="profile-card">
            <AccountCircleIcon className="profile-icon" />
            <h2>{profile.name || 'null'}</h2>
            <p>Experience: {profile.experience || 'null'} years</p>
            <p>Job Role: {profile.jobRole || 'null'}</p>
            <p>AI Score: {profile.aiScore || 'null'}</p>
        </div>
    );
};
 
export const Candidatecards = ({ selectedFilters }) => {
    const [profileData, setProfileData] = useState([]);
 
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
 
        const fetchData = async () => {
            try {
                const response = await axios.get('http://172.235.10.116:7000/hiring/entryLevel/getAllCandidates', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                // Extracting only required fields from the response and handling null values
                const extractedData = response.data.map(profile => ({
                    name: profile.name || 'null',
                    experience: profile.experience || 'null',
                    jobRole: profile.jobRole || 'null',
                    aiScore: profile.resumeScore || 'null'
                }));
                console.log(response.data)
                setProfileData(extractedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
 
        if (token) {
            fetchData();
        } else {
            console.error('Access token not found in localStorage.');
        }
    }, []);
 
 
    let filteredData = [...profileData];
    selectedFilters.forEach(filter => {
        if (filter === "AI Score Ascending") {
            filteredData.sort((a, b) => a.aiScore - b.aiScore);
        } else if (filter === "AI Score Descending") {
            filteredData.sort((a, b) => b.aiScore - a.aiScore);
        } else if (filter === "Experience Ascending") {
            filteredData.sort((a, b) => a.experience - b.experience);
        } else if (filter === "Experience Descending") {
            filteredData.sort((a, b) => b.experience - a.experience);
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
                </div> : <center><h2 className="profile-card-container">No Cards to Display</h2></center>
                }
 
            </div>
        </>
    );
};
 