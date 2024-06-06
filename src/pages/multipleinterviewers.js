// import React, { useState, useEffect} from "react";
// import { Tooltip, Select, Button, Modal } from "antd";
// import DeleteIcon from '@mui/icons-material/Delete';
// import IconButton from '@mui/material/IconButton';
// import AlarmIcon from '@mui/icons-material/Alarm';
// import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// import Meeting from "../components/meet/Meet";
// import axios from 'axios'; // Import Axios library

// const { Option } = Select;

// const Toolkit = ({ interviewerList, selectedcard, handleclick, interviewers1}) => {
//   const [toolkits, setToolkits] = useState([]);
//   const [interviewerstate, setinterviewerstate] = useState(selectedcard.interviewer);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [isModalMeet, setIsModalMeet] = useState(false);

//   useEffect(() => {
//     if (selectedcard && selectedcard.interviewer) {
//       const initialToolkits = selectedcard.interviewer.map(interviewerId => ({ interviewer: interviewerId }));
//       setToolkits(initialToolkits);
//     }
//   }, [selectedcard]);

//   const handleModalMeet = () => {
//     setIsModalMeet(false);
//   };
    
//   const handleAddToolkit = () => {
//     setToolkits([...toolkits, { interviewer: null }]);
//   };

//   const handleSelectChange = (index, value) => {
//     const updatedToolkits = [...toolkits];
//     updatedToolkits[index].interviewer = value;
//     const updatedInterviewerState = [...interviewerstate];
//     updatedInterviewerState[index] = value;
//     setinterviewerstate(updatedInterviewerState);
//     selectedcard['interviewer'] = updatedInterviewerState;
//     setToolkits(updatedToolkits);
//   };

//   const handleDeleteToolkit = async (index) => {
//     const updatedToolkits = [...toolkits];
//     updatedToolkits.splice(index, 1);
//     setToolkits(updatedToolkits);
  
//     const updatedInterviewers = [...selectedcard.interviewer];
//     const removedInterviewerId = updatedInterviewers.splice(index, 1)[0];
  
//     // Update the interviewer array directly in the selectedcard prop
//     selectedcard.interviewer = updatedInterviewers;
  
//     try {
//       // Make API call to remove the interviewer
//       await axios.post('https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/removeinterviewer', {
//         candidate_id: selectedcard.id,
//         interviewer_id: removedInterviewerId, // Send the removed interviewer's ID
//       });
//     } catch (error) {
//       console.error('Error occurred while removing interviewer:', error);
//       // Handle error as needed
//     }
//   };
  

//   const handleModalOpen = (index) => {
//     setIsModalMeet(true);
//     setSelectedIndex(index);
//   };

//   return (
//     <>
//       {toolkits.map((toolkit, index) => (
//         <div key={index} style={{ }}>
//           <Tooltip title="Interviewer">
//             <Select
//               placeholder="Interviewer"
//               value={toolkit.interviewer}
//               onChange={(value) => handleSelectChange(index, value)}
//               style={{ width: 134, marginTop : '5px', marginRight : '5px'}}
//             >
//               {interviewerList.map((interviewer) => (
//                 <Option key={interviewer.id} value={interviewer.id}>
//                   {interviewer.name}
//                 </Option>
//               ))}
//             </Select>
//           </Tooltip>
//           <IconButton aria-label="delete" onClick={() => handleDeleteToolkit(index)} size="small" style={{marginRight : '5px' }} className="delete-icon-button">
//             <DeleteIcon />
//           </IconButton>
//           <IconButton aria-label="add an alarm" onClick={() => handleModalOpen(index)} className="add-alarm-icon-button" >
//             <AlarmIcon />
//           </IconButton>
//           {/* {console.log({...selectedcard, interviewer : selectedcard.interviewer[index]})} */}
//           <Modal
//             open={isModalMeet}
//             onCancel={handleModalMeet}
//             width={570}
//             footer={[]}
//           >
//             <Meeting onSave={handleModalMeet} prevData={{...selectedcard, interviewer : selectedcard.interviewer[selectedIndex]}} />
//           </Modal>
//         </div>
//       ))}
//       <Button onClick={handleAddToolkit} style={{ width: "135px", marginTop : '5px' }}>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <PersonAddAltIcon  style={{marginRight : '5px'}} />
//           Interviewer
//         </div>
//       </Button>
//     </>
//   );
// };

// export default Toolkit;



import React, { useState, useEffect} from "react";
import { Tooltip, Select, Button, Modal, notification } from "antd";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AlarmIcon from '@mui/icons-material/Alarm';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import Meeting from "../components/meet/Meet";
import axios from 'axios'; // Import Axios library
 
const { Option } = Select;
 
const Toolkit = ({ interviewerList, selectedcard, handleclick, interviewers1,handletechmodal}) => {
  const [toolkits, setToolkits] = useState([]);
  const [interviewerstate, setinterviewerstate] = useState(selectedcard.interviewer);
  const [openModalIndex, setOpenModalIndex] = useState(null); // New state to manage which modal should be opened
  const [isModalMeet, setIsModalMeet] = useState(false);
 
  useEffect(() => {
    if (selectedcard && selectedcard.interviewerorder) {
      const initialToolkits = selectedcard.interviewerorder.map(interviewerId => ({ interviewer: interviewerId }));
      setToolkits(initialToolkits);
    }
  }, [selectedcard]);
 
  const handleModalMeet = () => {
    setIsModalMeet(false);
    setOpenModalIndex(null); // Reset openModalIndex when modal is closed
  };
    
  const handleAddToolkit = () => {
    setToolkits([...toolkits, { interviewer: null }]);
  };
 
  const handleSelectChange = (index, value) => {
    const updatedToolkits = [...toolkits];
    updatedToolkits[index].interviewer = value;
    setToolkits(updatedToolkits);
 
    // Update the selected interviewer ID at the specific index
    const updatedSelectedCard = { ...selectedcard };
    updatedSelectedCard.interviewer[index] = value;
    // handleclick(updatedSelectedCard); 
  };
 
  const handleDeleteToolkit = async (index) => {
    const updatedToolkits = [...toolkits];
    updatedToolkits.splice(index, 1);
    setToolkits(updatedToolkits);
  
    const updatedInterviewers = [...selectedcard.interviewerorder];
    const removedInterviewerId = updatedInterviewers.splice(index, 1)[0];
  
    // Update the interviewer array directly in the selectedcard prop
    selectedcard.interviewer = updatedInterviewers;
  
    try {
      // Make API call to remove the interviewer
      await axios.post('https://hireflowapidev.focusrtech.com:90/hiring/entryLevel/removeinterviewer', {
        candidate_id: selectedcard.id,
        interviewer_id: removedInterviewerId, // Send the removed interviewer's ID
      });
      handletechmodal()
      notification.success({ message: 'Interviewer removed successfully' });
    } catch (error) {
      console.error('Error occurred while removing interviewer:', error);
      // Handle error as needed
    }
  };
  
 
  const handleModalOpen = (index) => {
    setIsModalMeet(true);
    setOpenModalIndex(index); 
  };
  const checkCondition=()=>{
    console.log("ENteringconditons")
    // {selectedcard && (selectedcard.recruiterSubmissionStatus === "SUBMITTED"||selectedcard.currentStatus==="IN_TECH")
    
    if(selectedcard.recruiterSubmissionStatus==="SUBMITTED"&&selectedcard.currentStatus!=="IN_TECH"){
      console.log("ENteringconditons")
      return true;
    }
    else{
      return false;
    }
      
   }
  return (
    <>
      {toolkits.map((toolkit, index) => (
  <div key={index} style={{}}>
    <Tooltip title="Interviewer">
      <Select
        placeholder="Interviewer"
        value={toolkit.interviewer}
        onChange={(value) => handleSelectChange(index, value)}
        style={{ width: 134, marginTop: '5px', marginRight: '5px' }}
        disabled={checkCondition()}
      >
        {interviewerList
          .filter(interviewer => !toolkits.some(t => t.interviewer === interviewer.id && t.interviewer !== toolkit.interviewer)) // Filter out already selected interviewers
          .map((interviewer) => (
            <Option key={interviewer.id} value={interviewer.id}>
              {interviewer.name}
            </Option>
          ))}

            </Select>
          </Tooltip>
          <IconButton aria-label="delete" onClick={() => handleDeleteToolkit(index)} size="small" style={{marginRight : '5px' }} className="delete-icon-button">
            <DeleteIcon />
          </IconButton>
          <IconButton aria-label="add an alarm" onClick={() => handleModalOpen(index)} className="add-alarm-icon-button" >
            <AlarmIcon />
          </IconButton>
          <Modal
            open={isModalMeet && openModalIndex === index} // Check if this modal should be opened
            onCancel={handleModalMeet}
            width={570}
            footer={[]}
          >
            <Meeting onSave={handleModalMeet} prevData={{...selectedcard, interviewer : selectedcard.interviewer[index]}} />
          </Modal>
        </div>
      ))}
      <Button onClick={handleAddToolkit} style={{ width: "135px", marginTop : '5px' }} 
      disabled={checkCondition()}
      // disabled={false}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <PersonAddAltIcon  style={{marginRight : '5px'}} />
          Interviewer
        </div>
      </Button>
    </>
  );
};
 
export default Toolkit;
 
 