import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { asyncActions } from "./parishActions";

export type SliceType = {
  status: "Idle" | "Loading" | "Error";
  parishes: ParishType[];
  parish?: ParishType;
  sort?: "Id/Asc" | "Id/Dsc" | "Mun/Asc" | "Mun/Dsc" | "Par/Asc" | "Par/Dsc";
  error?: ErrorType;
};

const initialState: SliceType = {
  status: "Idle",
  parishes: [],
};

const parishSlice = createSlice({
  name: "parish",
  initialState,
  reducers: {
    sortById: (state) => {
      const arr = [...state.parishes];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.parishes = arr.sort((a, b) => b.id - a.id);
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.parishes = arr.sort((a, b) => a.id - b.id);
          break;
        default:
          state.sort = "Id/Asc";
          state.parishes = arr.sort((a, b) => a.id - b.id);
      }
    },
    sortByName: (state) => {
      const arr = [...state.parishes];
      switch (state.sort) {
        case "Par/Asc":
          state.sort = "Par/Dsc";
          state.parishes = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0
          );
          break;
        case "Par/Dsc":
          state.sort = "Par/Asc";
          state.parishes = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        default:
          state.sort = "Par/Asc";
          state.parishes = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.getAllParishes.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllParishes.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.parishes = action.payload;
      })
      .addCase(asyncActions.getAllParishes.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getParishesByName.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getParishesByName.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.parishes = action.payload;
      })
      .addCase(asyncActions.getParishesByName.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getParishById.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getParishById.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.parish = action.payload;
      })
      .addCase(asyncActions.getParishById.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getParishesByMunicipality.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(
        asyncActions.getParishesByMunicipality.fulfilled,
        (state, action) => {
          state.status = "Idle";
          state.error = undefined;
          state.parishes = action.payload;
        }
      )
      .addCase(
        asyncActions.getParishesByMunicipality.rejected,
        (state, action) => {
          state.status = "Error";
          state.error = action.payload;
        }
      )
      .addCase(asyncActions.createParish.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createParish.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.parishes = [...state.parishes, action.payload];
      })
      .addCase(asyncActions.createParish.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editParish.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editParish.fulfilled, (state, action) => {
        state.status = "Idle";
        state.parishes = state.parishes.map((parish) =>
          parish.id === action.payload.id ? action.payload : parish
        );
      })
      .addCase(asyncActions.editParish.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.deleteParish.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.deleteParish.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.parishes = state.parishes.filter((parish) => {
          parish.id != action.payload;
        });
      })
      .addCase(asyncActions.deleteParish.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...parishSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectParishes: (state: RootState) => state.parish.parishes,
  selectParish: (state: RootState) => state.parish.parish,
  selectStatus: (state: RootState) => state.parish.status,
  selectSort: (state: RootState) => state.parish.sort,
  selectError: (state: RootState) => state.parish.error,
};

export default parishSlice.reducer;
