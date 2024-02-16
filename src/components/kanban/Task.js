// Task.js
import React from "react";
import { Draggable } from "react-beautiful-dnd";



const Task = ({ task, index, handleCardClick }) => {

const avatarUrl = process.env.PUBLIC_URL + "./img/avtr3.jpg"


  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
    {(provided) => (
        
      <li
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={() => handleCardClick(task)}
        style={{
          ...provided.draggableProps.style,
          cursor: "pointer",
          position: "relative",
        }}
      >
        <img className="avatarkan" src={avatarUrl} alt="User Avatar" />
        <h2 style={{ marginLeft: "-200px" }}>{task.name}</h2>
        <p >Role: {task.jobRole}</p>
        <p >Experience: {task.yearsOfExperience}</p>
        <div
          style={{
            display:"flex",
            justifyContent:"center",
            textAlign:"center",
           
            position: "relative",
            width:"40px",
            bottom: "10px",
            left: "10px",
            padding: "4px",
            marginLeft:"10px",
            marginTop:"30px",
            backgroundColor: "#79feac",
            borderRadius: "20px",
          }}
        >
          {task.resumeScore}

          
        </div>
      </li>

    )}
  </Draggable>
  );
};

export default Task;
