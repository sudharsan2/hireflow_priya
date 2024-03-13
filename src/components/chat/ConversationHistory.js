import './conversation.css';

////////////////////////////////////////////////////////////

export default function ConversationHistory({ selectedUser }) {
    return (
      <div className="conversation-history-container">
        <h1 className="header">Conversation History</h1>
        <div className="email-list">
          {Object.keys(selectedUser).map((userId) => (
            <div key={userId} className="email-item">
              <h2 className="user-name">Selected User: {selectedUser[userId].emailAddress}</h2>
              <p className="date-time">Date and Time: {selectedUser[userId].dateAndTime}</p>
              <div
                className="email-content"
                dangerouslySetInnerHTML={{ __html: selectedUser[userId].emailContent }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  
  
  



