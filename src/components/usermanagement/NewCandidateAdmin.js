
import React, { useState } from "react";
import Usernav from "./Usernav";
import { Stats } from "./NewCandidateStat";
import { Candidatecards } from "./NewCandidateCards";
import FilterPopup from "./NewCandidateFilter";
import './NewCandidateAdmin.css';
 
export function Newcandidate() {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
 
    const handleAssignClick = () => {
        console.log("Assign clicked!");
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
 
                <Candidatecards selectedFilters={selectedFilters} />
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
 