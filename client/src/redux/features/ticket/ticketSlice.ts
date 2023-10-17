import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { asyncActions } from "./ticketActions";

export type SliceType = {
  status: "Idle" | "Loading" | "Success" | "Error";
  statusUpdate: "Idle" | "Loading" | "Success" | "Error";
  ticket?: TicketType & Partial<DispatchTicket>;
  tickets: MiniTicket[];
  error?: ErrorType;
};

export const initialState: SliceType = {
  error: undefined,
  status: "Idle",
  statusUpdate: "Idle",
  ticket: undefined,
  tickets: [],
};

const ticketSlice = createSlice({
  name: "ticket",
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
      .addCase(asyncActions.postTicketOperator.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.postTicketOperator.fulfilled, (state) => {
        state.status = "Success";
        state.error = undefined;
      })
      .addCase(asyncActions.postTicketOperator.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.postTicketCloseOperator.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.postTicketCloseOperator.fulfilled, (state) => {
        state.status = "Success";
        state.error = undefined;
      })
      .addCase(
        asyncActions.postTicketCloseOperator.rejected,
        (state, action) => {
          state.status = "Error";
          state.error = action.payload;
        }
      )
      .addCase(asyncActions.putTicketUpdateDispatcher.pending, (state) => {
        state.statusUpdate = "Loading";
      })
      .addCase(asyncActions.putTicketUpdateDispatcher.fulfilled, (state) => {
        state.statusUpdate = "Success";
        state.error = undefined;
      })
      .addCase(
        asyncActions.putTicketUpdateDispatcher.rejected,
        (state, action) => {
          state.statusUpdate = "Error";
          state.error = action.payload;
        }
      )
      .addCase(asyncActions.putTicketCloseDispatcher.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(
        asyncActions.putTicketCloseDispatcher.fulfilled,
        (state, action) => {
          state.status = "Success";
          state.error = undefined;
          state.tickets = [
            ...state.tickets.filter(
              (ticket) => ticket.id !== action.payload.id
            ),
          ];
        }
      )
      .addCase(
        asyncActions.putTicketCloseDispatcher.rejected,
        (state, action) => {
          state.status = "Error";
          state.error = action.payload;
        }
      )
      .addCase(asyncActions.getTicketsDispatcher.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getTicketsDispatcher.fulfilled, (state, action) => {
        state.status = "Success";
        state.error = undefined;
        state.tickets = action.payload;
      })
      .addCase(asyncActions.getTicketsDispatcher.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getTicket.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getTicket.fulfilled, (state, action) => {
        state.status = "Success";
        state.error = undefined;
        state.ticket = action.payload;
      })
      .addCase(asyncActions.getTicket.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...ticketSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectError: (state: RootState) => state.ticket.error,
  selectStatus: (state: RootState) => state.ticket.status,
  selectStatusUpdate: (state: RootState) => state.ticket.statusUpdate,
  selectTicket: (state: RootState) => state.ticket.ticket,
  selectTickets: (state: RootState) => state.ticket.tickets,
};

export default ticketSlice.reducer;
