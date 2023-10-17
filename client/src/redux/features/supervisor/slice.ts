import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { asyncActions } from "./actions";

export type SliceType = {
  status: "Idle" | "Loading" | "Success" | "Tickets" | "Error";
  statusUpdate: "Idle" | "Loading" | "Success" | "Error";
  error?: ErrorType;
  dates: number[][];
  tickets: MiniTicketSupervisor[];
  count: { closing_state: string; count: number }[];
};

export const initialState: SliceType = {
  error: undefined,
  status: "Idle",
  statusUpdate: "Idle",
  dates: [],
  tickets: [],
  count: [],
};

const supervisorSlice = createSlice({
  name: "supervisor",
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.status = "Idle";
    },
    clearStatusUpdate: (state) => {
      state.statusUpdate = "Idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actions.getDates.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(actions.getDates.fulfilled, (state, action) => {
        state.status = "Success";
        state.dates = action.payload.dates;
      })
      .addCase(actions.getDates.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(actions.getTickets.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(actions.getTickets.fulfilled, (state, action) => {
        state.status = "Success";
        state.tickets = action.payload.tickets;
        state.count = action.payload.count;
      })
      .addCase(actions.getTickets.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...supervisorSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectError: (state: RootState) => state.supervisor.error,
  selectStatus: (state: RootState) => state.supervisor.status,
  selectStatusUpdate: (state: RootState) => state.supervisor.statusUpdate,
  selectDates: (state: RootState) => state.supervisor.dates,
  selectTickets: (state: RootState) => state.supervisor.tickets,
  selectCount: (state: RootState) => state.supervisor.count,
};

export default supervisorSlice.reducer;
