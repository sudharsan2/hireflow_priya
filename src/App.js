// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Usermanagement from "./pages/Usermanagement";
import First from "./pages/First";
import Candidate from "./pages/Candidate"
import Kanban from "./pages/Kanban";
import KanbanInterviewer from "./pages/KanbanInterviewer";
import ResultPage from "./components/usermanagement/ResultsPage";
// Import your first-page component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-page" element={<Usermanagement />} />
        <Route path="/kanban-recurit" element={<Kanban />} />
        <Route path="/kanban-Interviewer" element={<KanbanInterviewer />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/results-page" element={<ResultPage />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;