// Navbar.js

import React, { useState, useEffect } from "react";
import "./usernav.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Badge, Input } from "antd";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slices/authSlice";
import ResultPage from "./ResultsPage";
import { useSelector } from "react-redux";
// import { fetchSearchResults } from "../../../redux/slices/searchSlice";
import {
  moveTask,
  fetchTasksAsync,
  updateTaskAsync,
  fetchInterviewersAsync,
  updateWaitingTaskAsync,
  fetchFinalDataAsync,
} from "../../redux/slices/kanbanSlice";

import {
  Button,
  DatePicker,
  
  Modal,
  Select,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import WalkInCandidate from "../../pages/WalkinCandidate";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import { Notification } from "./Notification";

const Kanbannav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notificationCount, setNotificationCount] = useState(0);
  
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const loading = useSelector((state) => state.search.loading);
  const [newCandidate, setNewCandidate] = useState(false);
  const [isWalkinUpload, setIsWalkinUpload] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(logoutAction());
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get("https://hireflowapi.focusrtech.com:90/hiring/interviewer/notshortlistedNotification", {
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

  // const handleSearch = () => {
  //   // Only navigate when loading is true
  //   navigate("/results-page");
  //   dispatch(fetchSearchResults(searchInput));
  // };

  const handleClearNotification = () => {
    setNotificationCount(0)
  }

  const handleBadgeClick = () => {
    navigate("/chat-msg");
  };
  const handleIsWalkinUpload = () => {
    console.log("yes it works");
    setIsWalkinUpload(true);
    setNewCandidate(false);
  }
  const handleNewCandidate = () => {
    setNewCandidate(false);
  }
  const handleNewCandidateBtn = () => {
    console.log('btn clicked')
    setNewCandidate(true);
  }

  useEffect(() => {
    dispatch(fetchTasksAsync());
    dispatch(fetchInterviewersAsync());
    dispatch(fetchFinalDataAsync());
  }, [dispatch, moveTask, isSaved, isWalkinUpload]);




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
          {/* <span onClick={handleNewCandidateBtn} className="nav-span">
            Walk-in
          </span> */}


          <Modal
        open={newCandidate}
        onCancel={handleNewCandidate}
        width={540}
        footer={
          [
          ]
        }
      >
        <WalkInCandidate isWalkinUpload={handleIsWalkinUpload} />
      </Modal>
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
