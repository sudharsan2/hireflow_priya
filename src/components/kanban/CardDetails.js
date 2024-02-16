import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  UpdatedDataTask,
  fetchInterviewersAsync,
  updateTaskAsync,
} from "../../redux/slices/kanbanSlice";
import { useSelector } from "react-redux";

////////////////////////////////////////////////////////////////////////////////

const CardDetails = ({ cardData, onClose }) => {
  const dispatch = useDispatch();
  const [editedDetails, setEditedDetails] = useState({ ...cardData });
  const interviewers = useSelector((state) => state.kanban.interviewers);

  useEffect(() => {
    // Fetch interviewers when the component mounts
    dispatch(fetchInterviewersAsync());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setEditedDetails((prevDetails) => ({ ...prevDetails, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Dispatch the update action with the editedDetails and submissionStatus as 'SAVED'
      await dispatch(
        updateTaskAsync({ ...editedDetails, submissionStatus: "SAVED" })
      );
      console.log("Save clicked with data:", editedDetails);
      // Close the card details modal
      dispatch(UpdatedDataTask(editedDetails));
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle the error as needed
    }
  };

  const handleSubmit = async () => {
    try {
      // Dispatch the update action with the editedDetails and submissionStatus as 'SUBMITTED'
      await dispatch(
        updateTaskAsync({ ...editedDetails, submissionStatus: "SUBMITTED" })
      );
      console.log("Submit clicked with data:", editedDetails);
      // Close the card details modal

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
      // Handle the error as needed
    }
  };

  return (
    <Drawer
      anchor="right"
      open={true}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: 1, sm: 480 } } }}
    >
      <Paper
        sx={{
          px: 2,
          py: 2,

          width: 1,
          borderRadius: 4,
          position: "relative",
          boxShadow: (theme) =>
            theme.customShadows
              ? theme.customShadows.z1
              : "0px 1px 3px rgba(0, 0, 0, 0.12)",
          "&:hover": {
            boxShadow: (theme) =>
              theme.customShadows
                ? theme.customShadows.z16
                : "0px 6px 20px rgba(0, 0, 0, 0.16)",
          },
        }}
      >
        <Typography variant="h5">{cardData.name}</Typography>

        <Divider />

        {/* Render two Typography components for labels and two for values in each row */}
        {[
          [
            "Email",
            "ResumeId",
            editedDetails.email || "",
            editedDetails.resumeId || "",
          ],
          [
            "CurrentStatus",
            "ResumeScore",
            editedDetails.currentStatus || "",
            editedDetails.resumeScore || "",
          ],
          [
            "JobRole",
            "YearsOfExperience",
            editedDetails.jobRole || "",
            editedDetails.yearsOfExperience || "",
          ],
          [
            "PhoneNo",
            "YearOfGraduation",
            editedDetails.phoneNo || "",
            editedDetails.yearOfGraduation || "",
          ],
          // Add more pairs as needed
        ].map(([label1, label2, value1, value2], index) => (
          <Stack
            key={index}
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginTop: 1 }}
          >
            <Typography color="red">{label1}:</Typography>
            <Typography>{value1}</Typography>
            <Typography color="red">{label2}:</Typography>
            <Typography>{value2}</Typography>
          </Stack>
        ))}
        <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
          <TextField
            label="Location"
            size="small"
            value={editedDetails.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Qualification"
            size="small"
            value={editedDetails.qualification || ""}
            onChange={(e) => handleInputChange("qualification", e.target.value)}
            fullWidth
            margin="normal"
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
          <TextField
            label="Domain"
            size="small"
            value={editedDetails.domainExperience || ""}
            onChange={(e) =>
              handleInputChange("domainExperience", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reason"
            size="small"
            value={editedDetails.reason || ""}
            onChange={(e) => handleInputChange("reason", e.target.value)}
            fullWidth
            margin="normal"
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
          <TextField
            label="Travel"
            size="small"
            value={editedDetails.travelConstraint || ""}
            onChange={(e) =>
              handleInputChange("travelConstraint", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Reference"
            size="small"
            value={editedDetails.referenceName || ""}
            onChange={(e) => handleInputChange("referenceName", e.target.value)}
            fullWidth
            margin="normal"
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
          <TextField
            label="Reference Email"
            size="small"
            value={editedDetails.referenceEmail || ""}
            onChange={(e) =>
              handleInputChange("referenceEmail", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Notification Period"
            size="small"
            value={editedDetails.notificationPeriod || ""}
            onChange={(e) =>
              handleInputChange("notificationPeriod", e.target.value)
            }
            fullWidth
            margin="normal"
          />
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginTop: 1 }}>
          <TextField
            label="Father Occupation"
            size="small"
            value={editedDetails.fatherOccupation || ""}
            onChange={(e) =>
              handleInputChange("fatherOccupation", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mother Occupation"
            size="small"
            value={editedDetails.motherOccupation || ""}
            onChange={(e) =>
              handleInputChange("motherOccupation", e.target.value)
            }
            fullWidth
            margin="normal"
          />
        </Stack>
        <Stack direction="row" spacing={2}   sx={{ marginTop: 1 }}>
          {/* <Typography color="red">Shortlist Status:</Typography> */}
          <Select
            size="small"
            value={editedDetails.shortlistStatus || ""}
            onChange={(e) =>
              handleInputChange("shortlistStatus", e.target.value)
            }
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Shortlist Status
            </MenuItem>
            <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
            <MenuItem value="NOTSHORTLISTED">Not Shortlisted</MenuItem>
          </Select>

          <Select
            size="small"
            value={editedDetails.interviewer || ""}
            onChange={(e) => handleInputChange("interviewer", e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Interviewer
            </MenuItem>
            {interviewers.map((interviewer) => (
              <MenuItem key={interviewer.id} value={interviewer.empId}>
                {interviewer.username}
              </MenuItem>
            ))}
          </Select>
        </Stack>
       

        {/* Add more Typography pairs as needed */}
      </Paper>
      <Stack direction="row" spacing={2}  sx={{ marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleSubmit}>
          Sumbit
        </Button>
      </Stack>
    </Drawer>
  );
};

export default CardDetails;