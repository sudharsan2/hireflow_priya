import React from "react";
import axios from "axios";
import "./header.css"; // Import the CSS file for styling
import { notification } from "antd";

const HRRHeader = () => {
  const handleAssignClick = async () => {
   
    try {
      const apiUrl = "http://172.235.10.116:9090/hiring/entryLevel/assignRole/";

      // Make a POST request to the API
      const response = await axios.post(apiUrl);

      // Handle the response as needed (e.g., show a success message)
      console.log("Assign API response:", response.data);
      notification.success({
        message: response.data.message,
        description: "You have successfully Assigned .",
      });
    } catch (error) {
      console.error("Error triggering Assign API:", error.message);
      notification.error({
        message: error.response.data.message,
        description: `Server responded with ${error.response.status}`,
      });
      // Handle the error (e.g., show an error message)
    }
  };

  return (
    <div className="header">
      <h2>HRR</h2>

      {/* Trigger the handleAssignClick function on click */}
      <span className="assign-text" onClick={handleAssignClick}>
        Assign
      </span>
    </div>
  );
};

export default HRRHeader;