
import React, { useEffect, useState } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from 'axios';
import "./userList.css";
import api from "../../services/api";
import md5 from 'md5';
import UserAvatar from "./UserAvatar";
import Chats from "../../pages/Chats";
 
 
export default function UserList({ onUserClick }) {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
 
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const fetchData = async () => {
      try {
        const response = await axios.get('http://172.235.10.116:7000/hiring/entryLevel/getCandidateForRecruiter', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setUserList(response.data);
      } catch (error) {
        console.error('Error fetching notification data:', error);
      }
    };
    fetchData();
  }, []);
 
  const filteredUserList = userList.filter((user) =>
    user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleUserClick = (userName, email) => {
    const user = {
      "username": userName,
      "email": email
    };
    onUserClick(user);
    setSelectedUser(userName);
  };
 
  useEffect(() => {
    if (selectedUser) {
      const fetchChatMessages = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await axios.get(`http://172.235.10.116:7000/hiring/entryLevel/getemail${selectedUser}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setChatMessages(response.data.messages);
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      };
 
      fetchChatMessages();
    }
  }, [selectedUser]);
 
  return (
    <div className="user-list-container">
      <h2>Chats</h2>
      <input
        className="search-bar"
        type="text"
        placeholder="Search users..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="user-list">
        {filteredUserList.map((item, index) => (
          <li key={item.id}
            className={selectedUser === item.name ? 'selected-user' : ''}
            onClick={() => handleUserClick(item.name, item.email)}
          >
            <UserAvatar username={item.name} />
          </li>
        ))}
      </ul>
      {selectedUser && <Chats selectedUser={selectedUser} chatMessages={chatMessages} />}
    </div>
  );
}
 