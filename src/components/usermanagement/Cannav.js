// Navbar.js

import React, { useEffect, useState } from "react";
import "./usernav.css";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Input, Select, notification } from "antd";
import { logoutAction } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Cannav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Token", token);
    axios
      .get("https://hireflowapi.focusrtech.com:90/hiring/auth/getAllRoles", {
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

  const handleHome = () => {
    navigate("/admin-page");
  };

  const imgurl1 = process.env.PUBLIC_URL + "./img/icon1.png";
  const imgurl2 = process.env.PUBLIC_URL + "./img/frlogo.png";
  return (
    <nav className="navbar">
      <div className="navbar-left">
      {/* <img className="navbar-logo" src={imgurl2} />
        <div>
          <h2>HireFlow</h2>
          <p>by FocusR AI</p>
        </div> */}
        </div>
      <div className="navbar-right">
        <span onClick={handleHome} className="nav-span">
          Home
        </span>

        <span onClick={handleLogout} className="nav-span">
          Logout
        </span>
      </div>
    </nav>
  );
};

export default Cannav;
