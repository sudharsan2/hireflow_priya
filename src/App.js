// // App.js
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./components/Login";
// import Usermanagement from "./pages/Usermanagement";
// import First from "./pages/First";
// import Candidate from "./pages/Candidate";
// import Kanban from "./pages/Kanban";
// import KanbanInterviewer from "./pages/KanbanInterviewer";
// import ResultPage from "./components/usermanagement/ResultsPage";
// import Chats from "./pages/Chats";
// // Import your first-page component

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/admin-page" element={<Usermanagement />} />
//         <Route path="/kanban-recurit" element={<Kanban />} />
//         <Route path="/kanban-Interviewer" element={<KanbanInterviewer />} />
//         <Route path="/candidate" element={<Candidate />} />
//         <Route path="/results-page" element={<ResultPage />} />
//         <Route path="/chat-msg" element={<Chats />} />

//         {/* Add more routes as needed */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Usermanagement from "./pages/Usermanagement";
import First from "./pages/First";
import Candidate from "./pages/Candidate";
import Kanban from "./pages/Kanban";
import KanbanInterviewer from "./pages/KanbanInterviewer";
//import ResultPage from "./components/usermanagement/ResultsPage";
import Chats from "./pages/Chats";
import CustomLayout from "./layout/CustomLayout";

import AdminSummary from "./pages/summary/AdminSummary";
import HrrSummary from "./pages/summary/HrrSummary";
import { Newcandidate } from "./components/usermanagement/NewCandidateAdmin";
import Piechart from "./pages/Piechart";
import Admineval from "./pages/Admineval";
import TechSummary from "./pages/summary/TechSummary";
import ForgetPassword from "./components/usermanagement/forgetPassword";
import ResetPassword from "./components/usermanagement/resetPassword";
import LLMSummary from "./pages/summary/LLMSummary";
import Candidatequery from "./pages/CandidateQuery";
import CandidateAdmin from "./components/usermanagement/CandidatesDashboard";
import MyPage from "./pages/selectedCandidates";


const App = () => {

  
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-summary" element={<CustomLayout><AdminSummary /></CustomLayout>} />
        <Route path="/admin-page" element={<CustomLayout><Usermanagement /></CustomLayout>} />
        
        <Route path="/kanban-recurit" element={<CustomLayout><Kanban /></CustomLayout>} />
        <Route path="/kanban-Interviewer" element={<CustomLayout><KanbanInterviewer /></CustomLayout>} />
        <Route path="/candidate" element={<CustomLayout><Candidate /></CustomLayout>} />
        {/*<Route path="/results-page" element={<CustomLayout><ResultPage /></CustomLayout>} />*/}
        <Route path="/chat-msg" element={<CustomLayout><Chats /></CustomLayout>} />
        
        <Route path="/hrr-summary" element={<CustomLayout><HrrSummary/></CustomLayout>} />
        <Route path="/llmAdminSummary" element={<CustomLayout><LLMSummary/></CustomLayout>} />
        <Route/>
        <Route path="/tech-summary" element={<CustomLayout><TechSummary/></CustomLayout>} />
        <Route path="/add-candidate" element={<CustomLayout><Newcandidate /></CustomLayout>} />
        <Route path="/dashboard" element={<CustomLayout><Piechart /></CustomLayout>} />
        <Route path="/evaluation" element={<CustomLayout><Admineval /></CustomLayout>} />
        <Route path="/forgotPassword" element={<ForgetPassword/>} />
        <Route path="/resetPassword/:token" element={<ResetPassword/>} />
        <Route path="/candidatequery" element={<CustomLayout><Candidatequery/></CustomLayout>} />
        <Route path="/candidateadmin" element={<CustomLayout><CandidateAdmin/></CustomLayout>} />
        
        {/* Add more routes as needed */}
      <Route path= "/SelectedCandidates" element={<CustomLayout><MyPage/></CustomLayout>}/>
      </Routes>
    </Router>
    
  );
};

export default App;

