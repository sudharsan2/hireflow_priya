
 
import React, { useEffect, useState } from "react";
import Usernav from "./Usernav";
import { Stats } from "./NewCandidateStat";
import { Candidatecards } from "./NewCandidateCards";
import FilterPopup from "./NewCandidateFilter";
import './NewCandidateAdmin.css';
 
import axios from "axios";
import { notification } from "antd";
 
export function Newcandidate() {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [profileData, setProfileData] = useState([]);
 
    const handleAssignClick = async () => {
        try {
        const apiUrl = "https://hireflowapi.focusrtech.com:90/hiring/entryLevel/assignRole/";
   
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
    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('https://hireflowapi.focusrtech.com:90/hiring/entryLevel/getAllCandidates', {
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
            setProfileData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(()=>{
        fetchData();
    },[]);
    
 
    const toggleFilterModal = () => {
        setShowFilterModal(!showFilterModal);
    };
 
    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
    };
 
    const clearFilters = () => {
        setSelectedFilters([]);
    };
 
    return (
        <>
            <Usernav style={{ position: "fixed", top: 0, left: 0, width: "100%" }} />
 
            <div className="container">
                <div className="header">
                    <Stats />
                    <p className="assign-text" onClick={handleAssignClick} style={{ color: "white" }}>
                        ASSIGN
                    </p>
                    <p className="filter" onClick={toggleFilterModal} style={{ color: "White" }}>
                        SORT
                    </p>
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
 
                <Candidatecards selectedFilters={selectedFilters} candidateCards={profileData}/>
            </div>
 
            {showFilterModal && (
                <div className="modal-overlay" onClick={toggleFilterModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <FilterPopup onSelectFilter={handleFilterChange} onClose={toggleFilterModal} />
                    </div>
                </div>
            )}
        </>
    );
}
 