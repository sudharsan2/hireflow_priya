
import React, { useState, useEffect } from 'react';
import './NewCandidateStat.css';
import axios from 'axios';
 
 
 
const StatisticComponent = ({ label, value }) => {
    return (
        <tr>
            <td>{label}:</td>
            <td>{value || '0'}</td>
        </tr>
    );
};
 
export const Stats = () => {
    const [statsData, setstatsData] = useState([]);
 
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
 
        const fetchData = async () => {
            try {
                const response = await axios.get('https://hireflowapi.focusrtech.com:90/hiring/auth/statisticsforadmin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
 
                console.log(response.data)
                setstatsData(response.data);
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
    const keys = Object.keys(statsData);
    const keysToShow = Object.keys(statsData).slice(0, 2); // Get the first two keys

    return (
        <div className='stats'>
            {keys.length > 0 ? (
                <>
                    <table className="stats-table" style={{ padding: "20px" }}>
                        <h3 style={{ color: "rgb(0, 33, 64)", paddingLeft: "15px", marginTop: "0px", marginBottom: "10px" }}>STATS</h3>
                        <tbody>
                             {keysToShow.map((key, index) => (
      <StatisticComponent key={index} label={key} value={statsData[key]} />
    ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <table className="stats-table" style={{ padding: "20px" }}>
                    <h3 style={{ color: "rgb(0, 33, 64)", paddingLeft: "15px", marginTop: "0px", marginBottom: "0px" }}>STATS</h3>
                    <tbody>
                        <h2>No Stats Available</h2>
                    </tbody>
                </table>
            )}
        </div>
    );
};
 