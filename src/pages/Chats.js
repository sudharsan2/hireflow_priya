import axios from "axios";
import { useState } from "react";
import UserList from "../components/chat/UserList";
import ConversationHistory from "../components/chat/ConversationHistory";

// ////////////////////////////////////////////////////////////////

export default function Chats() {

  
    const [selectedUser, setSelectedUser] = useState({});
    const [spinFlag, setSpinFlag]=useState(false);
    const [currentUser, setCurrentUser]=useState({});

    function handleSentHistory(message){
        setSelectedUser(message);
        console.log("Full History",selectedUser);
    }
    // function handleCurrentUser(username){
      
    //   setCurrentUser(username);
    // }

    const handleUserClick = async (user) => {
      setSelectedUser({});
      setCurrentUser(user);
      setSpinFlag(true);
      const apiUrl = "http://172.235.10.116:7000/hiring/entryLevel/getemail";
      const recruiterMail = localStorage.getItem("mail");
  
      const payload = {
        recruiterMail: recruiterMail,
        candidateMail: user.email, // Use the clicked user's email from the userList
        password: "FCTai123",
      };
  
      try {
        const response = await axios.post(apiUrl, payload);
        setSpinFlag(false);
        // Update the selected user in the state
        setSelectedUser(response.data);
      } catch (error) {
        setSpinFlag(false);
      }
      
    };
    return (
      <div style={{ display: "flex", height: "100vh"}}>
        <div style={{ flex: "0.8", backgroundColor: "#edf0f5" }}>
          <UserList onUserClick={handleUserClick}/>
        </div>

        <div style={{ flex: "3.5", backgroundColor: "#f5f5f5" }}>
          <ConversationHistory selectedUser={selectedUser} flag={spinFlag} history={handleSentHistory} user={currentUser}/>
        </div>

      </div>
    );
  }
  