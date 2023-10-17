import { createSlice } from "@reduxjs/toolkit";
import { asyncActions } from "./actions";
import { RootState } from "../../store";

export type SliceType = {
  status: "Idle" | "Loading" | "Error";
  organisms: OrganismType[];
  sort?: "Id/Asc" | "Id/Dsc" | "Rsn/Asc" | "Rsn/Dsc";
  error?: ErrorType;
};

const initialState: SliceType = {
  status: "Idle",
  organisms: [],
};

const organismSlice = createSlice({
  name: "organism",
  initialState,
  reducers: {
    sortById: (state) => {
      const arr = [...state.organisms];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.organisms = arr.sort((a, b) => b.id - a.id);
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.organisms = arr.sort((a, b) => a.id - b.id);
          break;
        default:
          state.sort = "Id/Asc";
          state.organisms = arr.sort((a, b) => a.id - b.id);
      }
    },
    sortByName: (state) => {
      const arr = [...state.organisms];
      switch (state.sort) {
        case "Rsn/Asc":
          state.sort = "Rsn/Dsc";
          state.organisms = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0
          );
          break;
        case "Rsn/Dsc":
          state.sort = "Rsn/Asc";
          state.organisms = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        default:
          state.sort = "Rsn/Asc";
          state.organisms = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.getAllOrganisms.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllOrganisms.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.organisms = action.payload;
      })
      .addCase(asyncActions.getAllOrganisms.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getOrganismsByGroup.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getOrganismsByGroup.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.organisms = action.payload;
      })
      .addCase(asyncActions.getOrganismsByGroup.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.createOrganism.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createOrganism.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.organisms = [...state.organisms, action.payload];
      })
      .addCase(asyncActions.createOrganism.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editOrganism.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editOrganism.fulfilled, (state, action) => {
        state.status = "Idle";
        state.organisms = state.organisms.map((organism) =>
          organism.id === action.payload.id ? action.payload : organism
        );
      })
      .addCase(asyncActions.editOrganism.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.deleteOrganism.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.deleteOrganism.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.organisms = state.organisms.filter(
          (organism) => organism.id !== action.payload
        );
      })
      .addCase(asyncActions.deleteOrganism.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...organismSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectOrganisms: (state: RootState) => state.organism.organisms,
  selectStatus: (state: RootState) => state.organism.status,
  selectSort: (state: RootState) => state.organism.sort,
  selectError: (state: RootState) => state.organism.error,
};

export default organismSlice.reducer;
