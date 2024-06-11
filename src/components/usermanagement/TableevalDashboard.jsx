import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import {CustomLayout} from '../../layout/CustomLayout'


const CandidateStatusTable = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [nav, setnav] = useState('');
  // const []
  
  const handleClick = () => {
    setnav('/evaluation');
    

  };

  useEffect(() => {
    axios.get('https://hireflowapidev.focusrtech.com:90/hiring/auth/getallcadidatesforevaluation')
      .then(response => {
        const completedCount = response.data.filter(candidate => candidate.currentStatus === 'COMPLETED').length;
        const onHoldCount = response.data.filter(candidate => candidate.currentStatus === 'ON_HOLD').length;
        setStatusData([
          { status: 'Pending', count: completedCount },
          { status: 'On Hold', count: onHoldCount }
        ]);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: 'Candidate Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  // <CustomLayout state='/evaluation'/>
  return (
    <div style={{ width: '25vw', margin: '10px' }}>
    <Table columns={columns} dataSource={statusData} pagination={false}/>
    <div style={{ textAlign: 'center', backgroundColor:'white', paddingTop:'10px', paddingBottom:'10px', borderRadius:'0 0 5px 5px', fontSize:'1.2em', }}>
    <Link onClick={handleClick} style={{ display:'flex', alignItems:'center', justifyContent:'center'}} to="../evaluation">Admin Evaluation<LaunchIcon style={{marginLeft:'10px'}}/></Link>

    
  </div>
  </div>
  );
};

export default CandidateStatusTable;
