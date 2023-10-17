import {createSlice} from "@reduxjs/toolkit";
import {asyncActions} from "./actions";
import {RootState} from "../../store";

export type SliceType = {
  status: "Idle" | "Loading" | "Error";
  organismGroups: OrganismGroupType[]
  sort?: "Id/Asc" | "Id/Dsc" | "Rsn/Asc" | "Rsn/Dsc";
  error?: ErrorType;
};

const initialState: SliceType = {
  status: "Idle",
  organismGroups: []
};

const organismGroupSlice = createSlice({
  name: "organismGroup",
  initialState,
  reducers: {
    sortById: (state) => {
      const arr = [...state.organismGroups];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.organismGroups = arr.sort((a, b) => b.id - a.id);
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.organismGroups = arr.sort((a, b) => a.id - b.id);
          break;
        default:
          state.sort = "Id/Asc";
          state.organismGroups = arr.sort((a, b) => a.id - b.id);
      }
    },
    sortByName: (state) => {
      const arr = [...state.organismGroups];
      switch (state.sort) {
        case "Rsn/Asc":
          state.sort = "Rsn/Dsc";
          state.organismGroups = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0
          );
          break;
        case "Rsn/Dsc":
          state.sort = "Rsn/Asc";
          state.organismGroups = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        default:
          state.sort = "Rsn/Asc";
          state.organismGroups = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.getAllOrganismGroups.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllOrganismGroups.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.organismGroups = action.payload;
      })
      .addCase(asyncActions.getAllOrganismGroups.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.createOrganismGroup.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createOrganismGroup.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.organismGroups = [...state.organismGroups, action.payload];
      })
      .addCase(asyncActions.createOrganismGroup.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editOrganismGroup.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editOrganismGroup.fulfilled, (state, action) => {
        state.status = "Idle";
        state.organismGroups = state.organismGroups.map((organismGroup) =>
          organismGroup.id === action.payload.id ? action.payload : organismGroup
        );
      })
      .addCase(asyncActions.editOrganismGroup.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.deleteOrganismGroup.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.deleteOrganismGroup.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.organismGroups = state.organismGroups.filter(
          (organismGroup) => organismGroup.id !== action.payload
        );
      })
      .addCase(asyncActions.deleteOrganismGroup.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...organismGroupSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectOrganismGroups: (state: RootState) => state.organismGroup.organismGroups,
  selectStatus: (state: RootState) => state.organismGroup.status,
  selectSort: (state: RootState) => state.organismGroup.sort,
  selectError: (state: RootState) => state.organismGroup.error,
};

export default organismGroupSlice.reducer;
