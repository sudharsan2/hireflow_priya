import React, { useEffect, useState } from "react";
import Usernav from "./Usernav";
import {  Table, notification } from "antd";
import axios from "axios";
import './NewCandidateAdmin.css';

const CandidateAdmin = () => {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [profileData, setProfileData] = useState([]);

    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/getAllCandidates', {
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
    }

    useEffect(()=>{
        fetchData();
    },[]);

    const handleAssignClick = async () => {
        try {
            const apiUrl = "https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/assignRole/";

            // Make a POST request to the API
            const response = await axios.post(apiUrl);

            // Handle the response as needed (e.g., show a success message)
            console.log("Assign API response:", response.data);
            fetchData();
            notification.success({
                message: response.data.message,
                description: "You have successfully Assigned .",
            });

        } catch (error) {
            console.error("Error triggering Assign API:", error.message);
            notification.error({
                message: error.response.data.message,
                description: `Server responded with ${error.response.status}`,
            });
            // Handle the error (e.g., show an error message)
        }
    };

    const toggleFilterModal = () => {
        setShowFilterModal(!showFilterModal);
    };

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };

    const clearFilters = () => {
        setSelectedFilters([]);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Experience',
            dataIndex: 'experience',
            key: 'experience',
        },
        {
            title: 'Job Role',
            dataIndex: 'jobRole',
            key: 'jobRole',
        },
        {
            title: 'AI Score',
            dataIndex: 'aiScore',
            key: 'aiScore',
        },
    ];

    return (
        <>
           
            <div className="container">
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <div className="header">
                    <h2 style={{marginLeft: '10%'}}>Candidate Management</h2>
                    <button
                    style={{
                        width: '100px',
                        height:'30px',
                        backgroundColor: '#249bea',
                        color: 'rgb(255,255,255)',
                        border: 'none', // Remove default border
                        borderRadius: '4px', // Add some border radius for a modern look
                        boxShadow: '0 2px 2px rgba(0,0,0,0.2)', // Add a subtle shadow
                        
                    }}
                    onClick={handleAssignClick}
                    >
                    ASSIGN
                    </button>

                    
                    {selectedFilters.length > 0 && (
                        <div className="selected-filters" style={{marginLeft:"10px"}}>
                            <h3>Filters Applied:</h3>
                            <ul>
                                {selectedFilters.map(filter => (
                                    <li key={filter}>{filter}</li>
                                ))}
                            </ul>
                            <button className="clear-button" onClick={clearFilters}>
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="footer" style={{ backgroundColor: "transparent" }}>
                <Table columns={columns} dataSource={profileData} />
            </div>

            {showFilterModal && (
                <div className="modal-overlay" onClick={toggleFilterModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        {/* Add FilterPopup component here */}
                    </div>
                    </div>
                
            )}
            </div>
        </>
    );
}

export default CandidateAdmin;
