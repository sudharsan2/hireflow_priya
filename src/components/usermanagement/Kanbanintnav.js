// Navbar.js

import React, { useEffect, useState } from "react";
import "./usernav.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slices/authSlice";
import { Avatar, Badge } from "antd";

////////////////////////////////////////////////////////////////////////////////

const Kanbanintnav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Token", token);
    axios
      .get("http://172.235.10.116:7000/hiring/auth/getAllRoles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setRoles(res.data);
      })
      .catch((err) => {
        console.log("Error in Lifecycle", err);
      });
  }, []); // Empty dependency array to run only once when the component mounts

  const handleLogout = () => {
    localStorage.clear(); // Clear all items in local storage
    dispatch(logoutAction());
    navigate("/", { replace: true });
  };

  const handleBadgeClick = () => {
    navigate("/chat-msg");
  };

  const imgurl2 = process.env.PUBLIC_URL + "./img/frlogo.png";
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img className="navbar-logo" src={imgurl2} />
        <div>
          <h2>HireFlow</h2>
          <p>by FocusR AI</p>
        </div>
      </div>
      <div className="navbar-right">
        <div onClick={handleBadgeClick}>
          <Badge color="gold" count={500}>
            <Avatar
              shape="square"
              size="medium"
              style={{ backgroundColor: "yellowgreen", cursor: "pointer" }}
            />
          </Badge>
        </div>
        <span onClick={handleLogout} className="nav-span">
          Logout
        </span>
      </div>
    </nav>
  );
};

export default Kanbanintnav;
