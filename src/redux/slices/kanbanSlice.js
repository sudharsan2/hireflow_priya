import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { dispatch } from "../store";

//////////////////////////////////////////////////////////////////

export const fetchTasksAsync = createAsyncThunk(
  "kanban/fetchTasks",
  async () => {
    try {
      const response = await api.get(
        "/hiring/entryLevel/getCandidateForRecruiter"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }
);

export const updateTaskAsync = createAsyncThunk(
  "kanban/updateTask",
  async (updatedData) => {
    try {
      const response = await api.put(
        `/hiring/entryLevel/updatedata/${updatedData.resumeId}/`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }
);

const kanbanSlice = createSlice({
  name: "kanban",
  initialState: {
    tasks: {
      Assigned: [],
      Tech: [],
      Waiting: [],
      Selected: [],
    },
    status: "idle",
    error: null,
  },
  reducers: {
    addTask: (state, action) => {
      const { column, task } = action.payload;
      state.tasks[column].push(task);
    },
    moveTask: (state, action) => {
      const { sourceColumn, destinationColumn, sourceIndex, destinationIndex } =
        action.payload;

      if (
        state.tasks[sourceColumn] &&
        state.tasks[destinationColumn] &&
        sourceIndex >= 0 &&
        sourceIndex < state.tasks[sourceColumn].length
      ) {
        const task = state.tasks[sourceColumn].splice(sourceIndex, 1)[0];

        console.log(`Moving task from ${sourceColumn} to ${destinationColumn}`);

        if (destinationColumn === "Tech") {
          task.currentStatus = "IN TECH";
        } else {
          // Adjust the condition and status based on your requirement
          task.currentStatus = "Some Other Status";
        }

        console.log("Updated task:", task);

        state.tasks[destinationColumn].splice(destinationIndex, 0, task);

       
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Assuming your API returns an array of tasks
        state.tasks.Assigned = action.payload;
      })
      .addCase(fetchTasksAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateTaskAsync.pending, (state) => {
        state.status = "updating";
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the corresponding task in your state with the new data if needed
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTask, moveTask } = kanbanSlice.actions;
export default kanbanSlice.reducer;
