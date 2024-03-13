// Navbar.js

import React, { useState } from "react";
import "./usernav.css";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "antd";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slices/authSlice";
import ResultPage from "./ResultsPage";
import { useSelector } from "react-redux";
import { fetchSearchResults } from "../../redux/slices/searchSlice";

const Kanbannav = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const searchResults = useSelector((state) => state.search.searchResults);
    const loading = useSelector((state) => state.search.loading);
  
    const [searchInput, setSearchInput] = useState("");
  
    const handleLogout = () => {
      localStorage.clear();
      dispatch(logoutAction());
      navigate("/", { replace: true });
    };
  
    const handleSearch = () => {
      dispatch(fetchSearchResults(searchInput));
      navigate('/results-page')
    };
  
  const imgurl1 = process.env.PUBLIC_URL + "./img/icon1.png";
  const imgurl2 = process.env.PUBLIC_URL + "./img/frlogo.png";
  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img className="navbar-logo" src={imgurl2} />
          <div>
            <h2>HireFlow</h2>
            <p>by FocusR AI</p>
          </div>
        </div>
        <div className="navbar-right">
          <Input.Search
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            loading={loading}
          />

          <span onClick={handleLogout} className="nav-span">
            Logout
          </span>
        </div>
      </nav>
     
    </>
  );
};

export default Kanbannav;
