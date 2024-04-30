import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://hireflowapi.focusrtech.com:90/hiring/auth/getAllUsers",
          {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                      },
                    }
        );
        const filteredUsers = response.data.filter(user => user.roles === 2);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'HR Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Status',
      dataIndex: 'pause',
      key: 'pause',
      render: (pause) => (
        <div style={{ backgroundColor: pause ? 'rgb(255, 167, 167)' : 'rgb(167, 255, 203)', padding: '2% 20%', borderRadius: '5px', textAlign: 'center' }}>
          <span>{pause ? 'Paused' : 'Active'}</span>
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', margin: '10px' }}>
      
      <Table dataSource={users} columns={columns} scroll={{ x: true }} pagination={{ pageSize: 4 }}/>
    </div>
  );
};

export default UserTable;
