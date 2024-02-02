// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import First from "./pages/First";
// Import your first-page component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/first-page" element={<First />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
