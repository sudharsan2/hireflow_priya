import React, { useState } from 'react';
import './NewCandidateFilter.css';
 
const FilterPopup = ({ onSelectFilter, onClose }) => {
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
 
    const handleFilterToggle = (filterName) => {
        setSelectedFilter(filterName);
    };
 
    const applyFilters = () => {
        if (selectedFilter) {
            onSelectFilter([selectedFilter]);
            onClose();
        } else {
            setShowPopup(true);
        }
    };
 
    return (
        <div>
            {showPopup && (
                <div className="popup">
                    Only one filter is allowed. Please select only one filter.
                    <button className="close-popup" onClick={() => setShowPopup(false)}>OK</button>
                </div>
            )}
            <table className="table">
                <thead>
                    <tr>
                        <th>Filter</th>
                        <th>Options</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>AI SCORE :</td>
                        <td>
                            <button
                                className="select-button"
                                onClick={() => handleFilterToggle("AI Score Ascending")}
                                style={{ backgroundColor: selectedFilter === "AI Score Ascending" ? 'rgb(30, 95, 155)' : 'rgb(0, 33, 64)' }}
                            >
                                Ascending
                            </button>
                            <button
                                className="select-button"
                                onClick={() => handleFilterToggle("AI Score Descending")}
                                style={{ backgroundColor: selectedFilter === "AI Score Descending" ? 'rgb(30, 95, 155)' : 'rgb(0, 33, 64)' }}
                            >
                                Descending
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>EXPERIENCE :</td>
                        <td>
                            <button
                                className="select-button"
                                onClick={() => handleFilterToggle("Experience Ascending")}
                                style={{ backgroundColor: selectedFilter === "Experience Ascending" ? 'rgb(30, 95, 155)' : 'rgb(0, 33, 64)' }}
                            >
                                Ascending
                            </button>
                            <button
                                className="select-button"
                                onClick={() => handleFilterToggle("Experience Descending")}
                                style={{ backgroundColor: selectedFilter === "Experience Descending" ? 'rgb(30, 95, 155)' : 'rgb(0, 33, 64)' }}
                            >
                                Descending
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>JOB ROLE :</td>
                        <td>
                            <button
                                className="select-button"
                                onClick={() => handleFilterToggle("Job Role Ascending")}
                                style={{ backgroundColor: selectedFilter === "Job Role Ascending" ? 'rgb(30, 95, 155)' : 'rgb(0, 33, 64)' }}
                            >
                                Ascending
                            </button>
                            <button
                                className="select-button"
                                onClick={() => handleFilterToggle("Job Role Descending")}
                                style={{ backgroundColor: selectedFilter === "Job Role Descending" ? 'rgb(30, 95, 155)' : 'rgb(0, 33, 64)' }}
                            >
                                Descending
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="button-group">
                <button className="apply-button" onClick={applyFilters}>Apply Filters</button>
                <button className="cancel-button" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};
 
export default FilterPopup;
 