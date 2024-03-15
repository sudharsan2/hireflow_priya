
import { useEffect, useState } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./userList.css";
import api from "../../services/api";
import md5 from 'md5';
import UserAvatar from "./UserAvatar";
///////////////////////////////////////////////////////////////////////////////
 
export default function UserList({ onUserClick}) {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
 
  useEffect(() => {
    const apiUrl = "/hiring/entryLevel/getCandidateForRecruiter";
 
    api
      .get(apiUrl)
      .then((response) => {
        setUserList(response.data);
      })
      .catch((error) => {
        console.log("Error Fetching Data: ", error);
      });
  }, []);
 
  const filteredUserList = userList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const handleUserClick = (userName, email) => {
    // currentuser(userName);
    const user={
      "username":userName,
      "email":email
    }
    onUserClick(user);
   
  };
 
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
    </div>
  );
}
 
 