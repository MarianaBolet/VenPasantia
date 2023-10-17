import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { asyncActions } from "./quadrantActions";

export type SliceType = {
  status: "Idle" | "Loading" | "Error";
  quadrants: QuadrantType[];
  quadrant?: QuadrantType;
  sort?: "Id/Asc" | "Id/Dsc" | "CCP/Asc" | "CCP/Dsc" | "Qua/Asc" | "Qua/Dsc";
  error?: ErrorType;
};

const initialState: SliceType = {
  status: "Idle",
  quadrants: [],
};

const quadrantSlice = createSlice({
  name: "quadrant",
  initialState,
  reducers: {
    sortById: (state) => {
      const arr = [...state.quadrants];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.quadrants = arr.sort((a, b) => b.id - a.id);
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.quadrants = arr.sort((a, b) => a.id - b.id);
          break;
        default:
          state.sort = "Id/Asc";
          state.quadrants = arr.sort((a, b) => a.id - b.id);
      }
    },
    sortByName: (state) => {
      const arr = [...state.quadrants];
      switch (state.sort) {
        case "Qua/Asc":
          state.sort = "Qua/Dsc";
          state.quadrants = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0
          );
          break;
        case "Qua/Dsc":
          state.sort = "Qua/Asc";
          state.quadrants = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        default:
          state.sort = "Qua/Asc";
          state.quadrants = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.getAllQuadrants.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllQuadrants.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.quadrants = action.payload;
      })
      .addCase(asyncActions.getAllQuadrants.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getQuadrantsByName.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getQuadrantsByName.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.quadrants = action.payload;
      })
      .addCase(asyncActions.getQuadrantsByName.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getQuadrantById.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getQuadrantById.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.quadrant = action.payload;
      })
      .addCase(asyncActions.getQuadrantById.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getQuadrantsByCCP.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getQuadrantsByCCP.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.quadrants = action.payload;
      })
      .addCase(asyncActions.getQuadrantsByCCP.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getQuadrantsByParish.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getQuadrantsByParish.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.quadrants = action.payload;
      })
      .addCase(asyncActions.getQuadrantsByParish.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.createQuadrant.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createQuadrant.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.quadrants = [...state.quadrants, action.payload];
      })
      .addCase(asyncActions.createQuadrant.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editQuadrant.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editQuadrant.fulfilled, (state, action) => {
        state.status = "Idle";
        state.quadrants = state.quadrants.map((quadrant) =>
          quadrant.id === action.payload.id ? action.payload : quadrant
        );
      })
      .addCase(asyncActions.editQuadrant.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.deleteQuadrant.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.deleteQuadrant.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.quadrants = state.quadrants.filter((quadrant) => {
          quadrant.id != action.payload;
        });
      })
      .addCase(asyncActions.deleteQuadrant.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...quadrantSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectQuadrants: (state: RootState) => state.quadrant.quadrants,
  selectQuadrant: (state: RootState) => state.quadrant.quadrant,
  selectStatus: (state: RootState) => state.quadrant.status,
  selectSort: (state: RootState) => state.quadrant.sort,
  selectError: (state: RootState) => state.quadrant.error,
};

export default quadrantSlice.reducer;
