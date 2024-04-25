// Navbar.js

import React, { useEffect, useState } from "react";
import "./usernav.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slices/authSlice";
import { Avatar, Badge } from "antd";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Button, Input, Select, notification, Modal } from "antd";
import { Notification } from "./Notification";
////////////////////////////////////////////////////////////////////////////////

const Kanbanintnav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [roles, setRoles] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const handleNotificationClick = () => {
    setShowNotificationModal(true);
  };
  const handleNotificationModalClose = () => {
    setShowNotificationModal(false);
  };
  const handleClearNotification = () => {
    setNotificationCount(0)
  }

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

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("https://hireflowapi.focusrtech.com:90/hiring/entryLevel/getMeetingNotification", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setNotificationCount(res.data.length);
      })
      .catch((err) => {
        console.log("Error fetching notifications:", err);
      });
  }, []);

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
    <nav className="navbar" style={{ height: '47px' }}>
      <div className="navbar-left">
        {/* <img className="navbar-logo" src={imgurl2} />
        <div>
          <h2>HireFlow</h2>
          <p>by FocusR AI</p>
        </div> */}
      </div>
      <div className="navbar-right">
        {/* <div onClick={handleBadgeClick}>
          <Badge color="gold" count={500}>
            <Avatar
              shape="square"
              size="medium"
              style={{ backgroundColor: "yellowgreen", cursor: "pointer" }}
            />
          </Badge>
        </div> */}
        <span onClick={handleNotificationClick} className="nav-span">
          <NotificationsNoneOutlinedIcon />
          {notificationCount > 0 && (
            <span className="notification-count">{notificationCount}</span>
          )}
        </span>
        <Modal
          title="Notifications"
          visible={showNotificationModal}
          onCancel={handleNotificationModalClose}
          footer={null}

        >
          <Notification onClearNotification={handleClearNotification} />
        </Modal>
        <span onClick={handleLogout} className="nav-span">
          Logout
        </span>
      </div>
    </nav>
  );
};

export default Kanbanintnav;
