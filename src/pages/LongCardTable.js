// import React, { useState, useEffect } from 'react';
// import { Table, Input, Checkbox, Button } from 'antd';
// import axios from 'axios';

// function LongCardTable({ apiUrl }) {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(apiUrl);
//         const jsonData = await response.json();
//         setData(jsonData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, [apiUrl]);

//   const columns = [
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>RES-ID</span>,
//       dataIndex: 'resumeId',
//       key: 'resumeId',
//       render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
//     },
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Name</span>,
//       dataIndex: 'name',
//       key: 'name',
//       render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
//     },
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>HRR</span>,
//       dataIndex: 'assigned',
//       key: 'assigned',
//       render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
//     },
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Interviewers</span>,
//       dataIndex: 'interviewerorder',
//       key: 'interviewerorder',
//       render: list => (
//         <div style={{ padding: '15px', whiteSpace: 'nowrap' }}>
//           {list.map((item, index) => (
//             <div key={index}>{`${index + 1}. ${item}`}</div>
//           ))}
//         </div>
//       ),
//     },    
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Final Remarks</span>,
//       dataIndex: 'finalRemarks',
//       key: 'finalRemarks',
//       render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
//     },
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Office Mail ID</span>,
//       dataIndex: 'officeMailId',
//       key: 'officeMailId',
//       render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e, record.resumeId, 'officeMailId')} />,
//     },
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Timesheet</span>,
//       dataIndex: 'timeSheet',
//       key: 'timeSheet',
//       render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e, record.resumeId, 'timeSheet')} />,
//     },
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Paysquare</span>,
//       dataIndex: 'paysquare',
//       key: 'paysquare',
//       render: paysquare => (paysquare ? <Checkbox checked /> : <Checkbox />),
//     },
//     {
//       title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Save</span>,
//       dataIndex: 'save',
//       key: 'save',
//       render: (text, record) => <Button type="primary" onClick={() => handleSave(record)}>Save</Button>,
//     },
//   ];

//   const handleInputChange = (e, resumeId, field) => {
//     const { value } = e.target;
//     setData(prevData => {
//       const newData = prevData.map(item => {
//         if (item.resumeId === resumeId) {
//           return { ...item, [field]: value };
//         }
//         return item;
//       });
//       return newData;
//     });
//   };

//   const handleSave = (record) => {
//     const { resumeId, officeMailId, timeSheet, paysquare } = record;
//     // Replace 'https://example.com/saveData' with your actual API endpoint
//     axios.post('https://hireflowapidev.focusrtech.com:90/hiring/auth/updatefinaldata', {
//       resumeId,
//       officeMailId,
//       timeSheet,
//       paysquare: paysquare ? 'True' : 'False',
//     })
//     .then(response => {
//       // Handle success
//     })
//     .catch(error => {
//       console.error('Error saving data:', error);
//     });
//   };

//   return (
//     <div>
//       <Table dataSource={data} columns={columns} pagination={false} rowKey="resumeId" />
//     </div>
//   );
// }

// export default LongCardTable;





import React, { useState, useEffect } from 'react';
import { Table, Input, Checkbox, Button } from 'antd';
import axios from 'axios';

function LongCardTable({ apiUrl }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const columns = [
    // Existing column definitions...
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>RES-ID</span>,
      dataIndex: 'resumeId',
      key: 'resumeId',
      render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
    },
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Name</span>,
      dataIndex: 'name',
      key: 'name',
      render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
    },
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>HRR</span>,
      dataIndex: 'assigned',
      key: 'assigned',
      render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
    },
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Interviewers</span>,
      dataIndex: 'interviewerorder',
      key: 'interviewerorder',
      render: list => (
        <div style={{ padding: '15px', whiteSpace: 'nowrap' }}>
          {list.map((item, index) => (
            <div key={index}>{`${index + 1}. ${item}`}</div>
          ))}
        </div>
      ),
    },    
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Final Remarks</span>,
      dataIndex: 'finalRemarks',
      key: 'finalRemarks',
      render: text => <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>{text}</span>,
    },
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Office Mail ID</span>,
      dataIndex: 'officeMailId',
      key: 'officeMailId',
      render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e, record.resumeId, 'officeMailId')} />,
    },
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Timesheet</span>,
      dataIndex: 'timeSheet',
      key: 'timeSheet',
      render: (text, record) => <Input value={text} onChange={(e) => handleInputChange(e, record.resumeId, 'timeSheet')} />,
    },
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap', textAlign: 'center' }}>Paysquare</span>,
      dataIndex: 'paysquare',
      key: 'paysquare',
      className: 'centered-column', // Add custom class for centering
      render: (paysquare, record) => (
        <Checkbox checked={paysquare} onChange={(e) => handleCheckboxChange(e, record)} />
      )
    },
    
    {
      title: <span style={{ padding: '15px', whiteSpace: 'nowrap' }}>Save</span>,
      dataIndex: 'save',
      key: 'save',
      render: (text, record) => <Button type="primary" onClick={() => handleSave(record)}>Save</Button>,
    },
    
    // Existing column definitions...
  ];

  const handleInputChange = (e, resumeId, field) => {
    const { value } = e.target;
    setData(prevData => {
      const newData = prevData.map(item => {
        if (item.resumeId === resumeId) {
          return { ...item, [field]: value };
        }
        return item;
      });
      return newData;
    });
  };

  const handleCheckboxChange = (e, record) => {
    const { checked } = e.target;
    const { resumeId } = record;
    setData(prevData => {
      const newData = prevData.map(item => {
        if (item.resumeId === resumeId) {
          return { ...item, paysquare: checked };
        }
        return item;
      });
      return newData;
    });
  };
  

  const handleSave = (record) => {
    const { resumeId, officeMailId, timeSheet, paysquare } = record;
    // Replace 'https://example.com/saveData' with your actual API endpoint
    axios.post('https://hireflowapidev.focusrtech.com:90/hiring/auth/updatefinaldata', {
      resumeId,
      officeMailId,
      timeSheet,
      paysquare,
    })
    .then(response => {
      // Handle success
    })
    .catch(error => {
      console.error('Error saving data:', error);
    });
  };

  return (
    <div >
      <Table  dataSource= {data} columns={columns} pagination={false} rowKey="resumeId" />
    </div>
  );
}

export default LongCardTable;
