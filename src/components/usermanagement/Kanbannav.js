// Navbar.js

import React, { useEffect, useState } from "react";
import "./usernav.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Badge, Input } from "antd";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slices/authSlice";
import ResultPage from "./ResultsPage";
import { useSelector } from "react-redux";
import { fetchSearchResults } from "../../redux/slices/searchSlice";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { notification, Modal } from "antd";
import { Notification } from "./Notification";

const Kanbannav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notificationCount, setNotificationCount] = useState(0);
  
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const loading = useSelector((state) => state.search.loading);

  const [searchInput, setSearchInput] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutAction());
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("http://127.0.0.1:8000/hiring/interviewer/notshortlistedNotification", {
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

  const handleSearch = () => {
    // Only navigate when loading is true
    navigate("/results-page");
    dispatch(fetchSearchResults(searchInput));
  };

  const handleClearNotification = () => {
    setNotificationCount(0)
  }

  const handleBadgeClick = () => {
    navigate("/chat-msg");
  };

  const imgurl1 = process.env.PUBLIC_URL + "./img/icon1.png";
  const imgurl2 = process.env.PUBLIC_URL + "./img/frlogo.png";
  const handleNotificationClick = () => {
    setShowNotificationModal(true);
  };
  const handleNotificationModalClose = () => {
    setShowNotificationModal(false);
  };
  return (
    <>
      <nav className="navbar" style={{ height: "50px" }}>
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
          {/* <Input.Search
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            loading={loading}
          /> */}
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
    </>
  );
};

export default Kanbannav;
