// Navbar.js

import React, { useEffect, useState } from "react";
import "./usernav.css";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Input, Select, notification } from "antd";

const Cannav = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [empIdError, setEmpIdError] = useState("");

  const [newUser, setNewUser] = useState({
    ROLE: "",
    Empid: "",
    Username: "",
    Password: "",
    email: "",
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("Token", token);
    axios
      .get("http://172.235.10.116:9090/hiring/auth/getAllRoles", {
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

  const handleRoleChange = (value) => {
    setNewUser((prevUser) => ({ ...prevUser, ROLE: value }));
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, email: value }));
  };

  const handleEmpidChange = (e) => {
    const { value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, Empid: value }));
  };

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, Username: value }));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, Password: value }));
  };

  const handleAddUserClick = () => {
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setAddUserModalOpen(false);
  };

  const handleAddUser = () => {
    setLoading(true);
    const postData = {
      email: newUser.email,
      username: newUser.Username,
      password: newUser.Password,
      empId: newUser.Empid,
      roles: newUser.ROLE,
    };

    axios
      .post("http://172.235.10.116:9090/hiring/auth/register/", postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log("User registration successful", response.data);
        // Additional logic if needed, e.g., updating the UI
        setLoading(false);
        notification.success({
          message: "User registration Successful",
          description: "You have successfully logged in.",
        });
        handleCloseAddUserModal();

        setNewUser({
          ROLE: "",
          email: "",
          Empid: "",
          Username: "",
          Password: "",
        });
      })
      .catch((error) => {
        console.error("Error in user registration", error);
        setLoading(false);

        if (error.response) {
          const errorData = error.response.data;

          // Check for specific error messages and update state variables
          setEmailError(errorData.email ? errorData.email[0] : "");
          setUsernameError(errorData.username ? errorData.username[0] : "");
          setEmpIdError(errorData.empId ? errorData.empId[0] : "");
          setRoleError(errorData.roles ? errorData.roles[0] : "");
          setPasswordError(errorData.password ? errorData.password[0] : "");
        }

        notification.error({
          message: "User registration failed",
          description: "Please check the form for errors.",
        });
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleHome = () => {
    
    navigate("/admin_page");
  };

  const imgurl1 = process.env.PUBLIC_URL + "./img/icon1.png";
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>HireFlow</h2>
        <p>by FocusR AI</p>
        
      </div>
      <div className="navbar-right">
      <span onClick= {handleHome} className="nav-span">
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
