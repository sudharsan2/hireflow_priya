// import React, { useEffect, useState } from "react";
// import Usernav from "./Usernav";
// import { Stats } from "./NewCandidateStat";
// import { Candidatecards } from "./NewCandidateCards";
// import FilterPopup from "./NewCandidateFilter";
// import './NewCandidateAdmin.css';
// import axios from "axios";
// import { notification, Modal } from "antd";

// export function Newcandidate() {
//     const [showFilterModal, setShowFilterModal] = useState(false);
//     const [selectedFilters, setSelectedFilters] = useState([]);
//     const [profileData, setProfileData] = useState([]);
//     const [assignModalVisible, setAssignModalVisible] = useState(false);

//     const handleAssignClick = async () => {
//         setAssignModalVisible(true);
//     };

//     const handleAssignConfirmation = async () => {
//         try {
//             const apiUrl = "https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/assignRole/";
//             const response = await axios.post(apiUrl);
//             fetchData();
//             notification.success({
//                 message: response.data.message,
//                 description: "You have successfully Assigned .",
//             });
//         } catch (error) {
//             console.error("Error triggering Assign API:", error.message);
//             notification.error({
//                 message: error.response.data.message,
//                 description: `Server responded with ${error.response.status}`,
//             });
//         }
//         setAssignModalVisible(false);
//     };

//     const fetchData = async () => {
//         const token = localStorage.getItem('accessToken');
//         try {
//             const response = await axios.get('https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/getAllCandidates', {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             });
//             const extractedData = response.data.map(profile => ({
//                 name: profile.name || 'null',
//                 experience: profile.yearsOfExperience || 'null',
//                 jobRole: profile.jobRole || 'null',
//                 aiScore: profile.resumeScore || 'null'
//             }));
//             setProfileData(extractedData);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const toggleFilterModal = () => {
//         setShowFilterModal(!showFilterModal);
//     };

//     const handleFilterChange = (filters) => {
//         setSelectedFilters(filters);
//     };

//     const clearFilters = () => {
//         setSelectedFilters([]);
//     };

//     return (
//         <>
//             <Usernav style={{ position: "fixed", top: 0, left: 0, width: "100%" }} />

//             <div className="container">
//                 <div className="header">
//                     <Stats />
//                     <p className="assign-text" onClick={handleAssignClick} style={{ color: "white" }}>
//                         ASSIGN
//                     </p>
//                     <p className="filter" onClick={toggleFilterModal} style={{ color: "White" }}>
//                         SORT
//                     </p>
//                     {selectedFilters.length > 0 && (
//                         <div className="selected-filters" style={{ marginLeft: "10px" }}>
//                             <h3>Filters Applied:</h3>
//                             <ul>
//                                 {selectedFilters.map(filter => (
//                                     <li key={filter}>{filter}</li>
//                                 ))}
//                             </ul>
//                             <button className="clear-button" onClick={clearFilters}>
//                                 Clear
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <div className="footer" style={{ backgroundColor: "transparent" }}>
//                 <Candidatecards selectedFilters={selectedFilters} candidateCards={profileData} />
//             </div>

//             {showFilterModal && (
//                 <div className="modal-overlay" onClick={toggleFilterModal}>
//                     <div className="modal" onClick={(e) => e.stopPropagation()}>
//                         <FilterPopup onSelectFilter={handleFilterChange} onClose={toggleFilterModal} />
//                     </div>
//                 </div>
//             )}

//             <Modal
//                 title="Assign Confirmation"
//                 visible={assignModalVisible}
//                 onOk={handleAssignConfirmation}
//                 onCancel={() => setAssignModalVisible(false)}
//             >
//                 <p>Are you sure you want to assign?</p>
//             </Modal>
//         </>
//     );
// }


import React, { useEffect, useState } from "react";
import Usernav from "./Usernav";
import { Stats } from "./NewCandidateStat";
import { Candidatecards } from "./NewCandidateCards";
import FilterPopup from "./NewCandidateFilter";
import './NewCandidateAdmin.css';
import axios from "axios";
import { notification, Modal } from "antd";

export function Newcandidate() {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [profileData, setProfileData] = useState([]);
    const [assignModalVisible, setAssignModalVisible] = useState(false);

    const handleAssignClick = async () => {
        setAssignModalVisible(true);
    };

    const handleAssignConfirmation = async () => {
        try {
            const apiUrl = "https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/assignRole/";
            const response = await axios.post(apiUrl);
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
        }
        setAssignModalVisible(false);
    };

    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.get('https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/getAllCandidates', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const extractedData = response.data.map(profile => ({
                id: profile.id || 'null',
                name: profile.name || 'null',
                experience: profile.yearsOfExperience || 'null',
                jobRole: profile.jobRole || 'null',
                aiScore: profile.resumeScore || 'null',
                status : profile.currentStatus || 'null'
            }));
            setProfileData(extractedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                        <div className="selected-filters" style={{ marginLeft: "10px" }}>
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
                <Candidatecards selectedFilters={selectedFilters} candidateCards={profileData} fetchData={fetchData} />
            </div>

            {showFilterModal && (
                <div className="modal-overlay" onClick={toggleFilterModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <FilterPopup onSelectFilter={handleFilterChange} onClose={toggleFilterModal} />
                    </div>
                </div>
            )}

            <Modal
                title="Assign Confirmation"
                visible={assignModalVisible}
                onOk={handleAssignConfirmation}
                onCancel={() => setAssignModalVisible(false)}
            >
                <p>Are you sure you want to assign?</p>
            </Modal>
        </>
    );
}
