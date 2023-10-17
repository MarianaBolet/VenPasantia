import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { asyncActions } from "./ccpActions";

export type SliceType = {
  status: "Idle" | "Loading" | "Error";
  ccps: CCPType[];
  ccp?: CCPType;
  sort?: "Id/Asc" | "Id/Dsc" | "Par/Asc" | "Par/Dsc" | "CCP/Asc" | "CCP/Dsc";
  error?: ErrorType;
};

const initialState: SliceType = {
  status: "Idle",
  ccps: [],
};

const ccpSlice = createSlice({
  name: "ccp",
  initialState,
  reducers: {
    sortById: (state) => {
      const arr = [...state.ccps];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.ccps = arr.sort((a, b) => b.id - a.id);
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.ccps = arr.sort((a, b) => a.id - b.id);
          break;
        default:
          state.sort = "Id/Asc";
          state.ccps = arr.sort((a, b) => a.id - b.id);
      }
    },
    sortByName: (state) => {
      const arr = [...state.ccps];
      switch (state.sort) {
        case "CCP/Asc":
          state.sort = "CCP/Dsc";
          state.ccps = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0
          );
          break;
        case "CCP/Dsc":
          state.sort = "CCP/Asc";
          state.ccps = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        default:
          state.sort = "CCP/Asc";
          state.ccps = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.getAllCCPs.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllCCPs.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.ccps = action.payload;
      })
      .addCase(asyncActions.getAllCCPs.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getCCPsByName.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getCCPsByName.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.ccps = action.payload;
      })
      .addCase(asyncActions.getCCPsByName.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getCCPById.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getCCPById.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.ccp = action.payload;
      })
      .addCase(asyncActions.getCCPById.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getCCPsByParish.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getCCPsByParish.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.ccps = action.payload;
      })
      .addCase(asyncActions.getCCPsByParish.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.createCCP.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createCCP.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.ccps = [...state.ccps, action.payload];
      })
      .addCase(asyncActions.createCCP.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editCCP.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editCCP.fulfilled, (state, action) => {
        state.status = "Idle";
        state.ccps = state.ccps.map((ccp) =>
          ccp.id === action.payload.id ? action.payload : ccp
        );
      })
      .addCase(asyncActions.editCCP.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.deleteCCP.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.deleteCCP.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.ccps = state.ccps.filter((ccp) => {
          ccp.id != action.payload;
        });
      })
      .addCase(asyncActions.deleteCCP.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...asyncActions,
  ...ccpSlice.actions,
};
export const selectors = {
  selectCCPs: (state: RootState) => state.ccp.ccps,
  selectCCP: (state: RootState) => state.ccp.ccp,
  selectStatus: (state: RootState) => state.ccp.status,
  selectSort: (state: RootState) => state.ccp.sort,
  selectError: (state: RootState) => state.ccp.error,
};
export default ccpSlice.reducer;
