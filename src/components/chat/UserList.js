import { useEffect, useState } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./userList.css";
import api from "../../services/api";

///////////////////////////////////////////////////////////////////////////////

export default function UserList({ onUserClick }) {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleUserClick = (userName) => {
    onUserClick(userName);
  };

  return (
    <div className="user-list-container">
      <input
       className="search-bar"
        type="text"
        placeholder="Search users..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="user-list">
        {filteredUserList.map((item, index) => (
          <li key={item.id} onClick={() => handleUserClick(item.name)}>
            <Avatar
              style={{
                backgroundColor: '#87d068',
              }}
              icon={<UserOutlined />}
            />
           {item.name.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}

