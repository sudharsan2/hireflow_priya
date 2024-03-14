import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

/////////////////////////////////////////////////////////////////////

export const fetchListofInterviewerAsync = createAsyncThunk(
  "summary/fetchInterviewer",
  async () => {
    try {
      const response = await api.get("/hiring/auth/getListOfInterviewer/");
      return response.data;
    } catch (error) {
      console.log("Error : ", error);
      throw error;
    }
  }
);

export const fetchListofRecruiterAsync = createAsyncThunk(
  "summary/fetchRecruiter",
  async () => {
    try {
      const response = await api.get("/hiring/auth/getListOfRecruiter/");
      return response.data;
    } catch (error) {
      console.log("Error : ", error);
      throw error;
    }
  }
);

export const fetchListofSourceAsync = createAsyncThunk(
  "summary/fetchSource",
  async () => {
    try {
      const response = await api.get("/hiring/auth/getSourceMode/");
      return response.data;
    } catch (error) {
      console.log("Error : ", error);
      throw error;
    }
  }
);

export const fetchCandidateDetailsAsync = createAsyncThunk(
  "summary/fetchCandidateDetails",
  async (requestData) => {
    try {
      const response = await api.post("/hiring/auth/summary", requestData);
      return response.data;
    } catch (error) {
      console.log("Error fetching candidate details:", error);
      throw error;
    }
  }
);

export const updateCandidateDataAsync = createAsyncThunk(
  "summary/updateCandidateData",
  async (requestData) => {
    try {
      const response = await api.put(`/hiring/entryLevel/updatedata/${requestData.resumeId}/`, requestData);
      return response.data;
    } catch (error) {
      console.error("Error updating candidate data:", error);
      throw error;
    }
  }
);


const summarySlice = createSlice({
  name: "summary",
  initialState: {
    interviewers: [],
    recruiters: [],
    source: [],
    candidateDetails: null,
    msg: "",
    error: "",
  },
  reducers: {
    setErrorMessage: (state, action) => {
      state.error = action.payload;
    },
    setMsgNull: (state, action) => {
      state.msg = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListofInterviewerAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListofInterviewerAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.interviewers = action.payload;
      })
      .addCase(fetchListofInterviewerAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchListofRecruiterAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListofRecruiterAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recruiters = action.payload;
      })
      .addCase(fetchListofRecruiterAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchListofSourceAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchListofSourceAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.source = action.payload;
      })
      .addCase(fetchListofSourceAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCandidateDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateDetails = action.payload;
      })
      .addCase(fetchCandidateDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCandidateDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the state with the updated data
        // For example, you may want to update the candidateDetails array
      })
      .addCase(updateCandidateDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setErrorMessage, setMsgNull } = summarySlice.actions;
export default summarySlice.reducer;

// Selectors
export const getCandidateDetails = (state) => state.summary.candidateDetails;
export const getErrorFromUser = (state) => state.summary.error;
export const getMsgFromUser = (state) => state.summary.msg;
