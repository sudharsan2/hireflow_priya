
import React from "react";
import axios from "axios";
import "./header.css"; // Import the CSS file for styling
import { useState, useEffect } from "react";
import "./usernav.css";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Button, Input, Select, notification } from "antd";
const HRRHeader = () => {
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
      .get("https://hireflowapidev.focusrtech.com:90/hiring/auth/getAllRoles", {
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
  }, []);
 
 
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
      .post("https://hireflowapidev.focusrtech.com:90/hiring/auth/register/", postData, {
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
          description: "You have successfully registered ",
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
 
 
  return (

    <div className="header">
      <p style={{fontSize:'10px'}}>HRR</p>
      <span onClick={handleAddUserClick}>
          <PersonAddAlt1Icon style={{ marginRight: "5px" }} />
          Add
        </span>
        {isAddUserModalOpen && (
          <>
            <div
              className="modal-backdrop"
              onClick={handleCloseAddUserModal}
            ></div>
            <div className="add-user-modal">
              <Select
                style={{ width: "91%", height: "100%" }}
                name="ROLE"
                value={newUser.ROLE}
                onChange={handleRoleChange}
                placeholder="Select the role"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
              {roleError && (
                <p
                  style={{ color: "red", marginTop: 0 }}
                  className="error-message"
                >
                  {roleError}
                </p>
              )}
              <Input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleEmailChange}
                placeholder="Enter the Email"
              />
              {emailError && (
                <p
                  style={{ color: "red", marginTop: 0 }}
                  className="error-message"
                >
                  {emailError}
                </p>
              )}
              <Input
                type="text"
                name="Empid"
                value={newUser.Empid}
                onChange={handleEmpidChange}
                placeholder="Enter the Empid"
              />
              {empIdError && (
                <p
                  style={{ color: "red", marginTop: 0 }}
                  className="error-message"
                >
                  {empIdError}
                </p>
              )}
              <Input
                type="text"
                name="Username"
                value={newUser.Username}
                onChange={handleUsernameChange}
                placeholder="Enter the Username"
              />
              {usernameError && (
                <p
                  style={{ color: "red", marginTop: 0 }}
                  className="error-message"
                >
                  {usernameError}
                </p>
              )}
              <Input
                type="text"
                name="Password"
                value={newUser.Password}
                onChange={handlePasswordChange}
                placeholder="Enter the password"
              />
              {passwordError && (
                <p
                  style={{ color: "red", marginTop: 0 }}
                  className="error-message"
                >
                  {passwordError}
                </p>
              )}
 
              <div className="button-container">
                <Button loading={loading} type="submit" onClick={handleAddUser}>
                  Add User
                </Button>
                <Button type="submit" onClick={handleCloseAddUserModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
     
    </div>
  );
};
 
export default HRRHeader;