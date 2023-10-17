import { createSlice } from "@reduxjs/toolkit";
import { asyncActions } from "./reasonActions";
import { RootState } from "../../store";

export type SliceType = {
  status: "Idle" | "Loading" | "Error";
  reasons: ReasonType[];
  reason?: ReasonType;
  sort?: "Id/Asc" | "Id/Dsc" | "Rsn/Asc" | "Rsn/Dsc";
  error?: ErrorType;
};

const initialState: SliceType = {
  status: "Idle",
  reasons: [],
};

const reasonSlice = createSlice({
  name: "reason",
  initialState,
  reducers: {
    sortById: (state) => {
      const arr = [...state.reasons];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.reasons = arr.sort((a, b) => b.id - a.id);
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.reasons = arr.sort((a, b) => a.id - b.id);
          break;
        default:
          state.sort = "Id/Asc";
          state.reasons = arr.sort((a, b) => a.id - b.id);
      }
    },
    sortByName: (state) => {
      const arr = [...state.reasons];
      switch (state.sort) {
        case "Rsn/Asc":
          state.sort = "Rsn/Dsc";
          state.reasons = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0
          );
          break;
        case "Rsn/Dsc":
          state.sort = "Rsn/Asc";
          state.reasons = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        default:
          state.sort = "Rsn/Asc";
          state.reasons = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.getAllReasons.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllReasons.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.reasons = action.payload;
      })
      .addCase(asyncActions.getAllReasons.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getReasonsByName.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getReasonsByName.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.reasons = action.payload;
      })
      .addCase(asyncActions.getReasonsByName.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getReasonById.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getReasonById.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.reason = action.payload;
      })
      .addCase(asyncActions.getReasonById.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.createReason.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createReason.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.reasons = [...state.reasons, action.payload];
      })
      .addCase(asyncActions.createReason.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editReason.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editReason.fulfilled, (state, action) => {
        state.status = "Idle";
        state.reasons = state.reasons.map((reason) =>
          reason.id === action.payload.id ? action.payload : reason
        );
      })
      .addCase(asyncActions.editReason.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.deleteReason.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.deleteReason.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.reasons = state.reasons.filter(
          (reason) => reason.id !== action.payload
        );
      })
      .addCase(asyncActions.deleteReason.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...reasonSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectReasons: (state: RootState) => state.reason.reasons,
  selectReason: (state: RootState) => state.reason.reason,
  selectStatus: (state: RootState) => state.reason.status,
  selectSort: (state: RootState) => state.reason.sort,
  selectError: (state: RootState) => state.reason.error,
};

export default reasonSlice.reducer;
