import React, { useState } from 'react';
import './LLMSummary.css';
import axios from 'axios'; // Import Axios
import { message, Button, Input, Pagination } from 'antd'; // Import message, Button, Input, and Pagination from Ant Design
import Usernav from "../../components/usermanagement/Usernav";

const LLMSummary = () => {
    const [responseData, setResponseData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false); // State for loading status
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            message.error('Please enter a search query.');
            return;
        }

        setLoading(true);

        axios.post('https://hireflowapi.focusrtech.com:90/hiring/auth/llmSearch', {
            query: searchQuery
        })
        .then(response => {
            setResponseData(response.data);
            setShowTable(true);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle errors if needed
        })
        .finally(() => {
            setLoading(false); // Set loading to false after API call completes
        });
    };

    const keys = responseData.length > 0 ? Object.keys(responseData[0]) : [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = responseData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>
        <Usernav />
        <div className="llmChatcontainer">
            <div className='inputContainer'>
                <Input 
                    placeholder='search here...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Display loading button when loading */}
                <Button type="primary" loading={loading} onClick={handleSearch}>Search</Button>
            </div>

            {showTable && (
                <div className="tableContainer">
                    <table>
                        <thead>
                            <tr>
                                {keys.map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, rowIndex) => (
                                <tr key={rowIndex}>
                                    {keys.map((key, colIndex) => (
                                        <td key={colIndex}>{data[key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        className="pagination"
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={responseData.length}
                        onChange={paginate}
                        style={{marginTop:'10px', 
                        // position:'fixed'
                    }}
                    />
                </div>
            )}
        </div>
        </>
        
    );
}

export default LLMSummary;
