import { createSlice } from "@reduxjs/toolkit";
import { asyncActions } from "./municipalityActions";
import { RootState } from "../../store";

export type SliceType = {
  status: "Idle" | "Loading" | "Error";
  municipalities: MunicipalityType[];
  municipality?: MunicipalityType;
  sort?: "Id/Asc" | "Id/Dsc" | "Mun/Asc" | "Mun/Dsc";
  error?: ErrorType;
};

const initialState: SliceType = {
  status: "Idle",
  municipalities: [],
};

const municipalitySlice = createSlice({
  name: "municipality",
  initialState,
  reducers: {
    sortById: (state) => {
      const arr = [...state.municipalities];
      switch (state.sort) {
        case "Id/Asc":
          state.sort = "Id/Dsc";
          state.municipalities = arr.sort((a, b) => b.id - a.id);
          break;
        case "Id/Dsc":
          state.sort = "Id/Asc";
          state.municipalities = arr.sort((a, b) => a.id - b.id);
          break;
        default:
          state.sort = "Id/Asc";
          state.municipalities = arr.sort((a, b) => a.id - b.id);
      }
    },
    sortByName: (state) => {
      const arr = [...state.municipalities];
      switch (state.sort) {
        case "Mun/Asc":
          state.sort = "Mun/Dsc";
          state.municipalities = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0
          );
          break;
        case "Mun/Dsc":
          state.sort = "Mun/Asc";
          state.municipalities = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          break;
        default:
          state.sort = "Mun/Asc";
          state.municipalities = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.getAllMunicipalities.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getAllMunicipalities.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.municipalities = action.payload;
      })
      .addCase(asyncActions.getAllMunicipalities.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getMunicipalitiesByName.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(
        asyncActions.getMunicipalitiesByName.fulfilled,
        (state, action) => {
          state.status = "Idle";
          state.error = undefined;
          state.municipalities = action.payload;
        }
      )
      .addCase(
        asyncActions.getMunicipalitiesByName.rejected,
        (state, action) => {
          state.status = "Error";
          state.error = action.payload;
        }
      )
      .addCase(asyncActions.getMunicipalityById.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getMunicipalityById.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.municipality = action.payload;
      })
      .addCase(asyncActions.getMunicipalityById.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.createMunicipality.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.createMunicipality.fulfilled, (state, action) => {
        state.status = "Idle";
        state.error = undefined;
        state.municipalities = [...state.municipalities, action.payload];
      })
      .addCase(asyncActions.createMunicipality.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.editMunicipality.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.editMunicipality.fulfilled, (state, action) => {
        state.status = "Idle";
        state.municipalities = state.municipalities.map((municipality) =>
          municipality.id === action.payload.id ? action.payload : municipality
        );
      })
      .addCase(asyncActions.editMunicipality.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "Error";
      })
      .addCase(asyncActions.deleteMunicipality.pending, (state) => {
        state.status = "Loading";
      })
			.addCase(asyncActions.deleteMunicipality.fulfilled, (state, action) => {
				state.status = "Idle";
				state.error = undefined;
				state.municipalities = state.municipalities.filter(municipality => municipality.id !== action.payload);
			})
      .addCase(asyncActions.deleteMunicipality.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...municipalitySlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectMunicipalities: (state: RootState) => state.municipality.municipalities,
  selectMunicipality: (state: RootState) => state.municipality.municipality,
  selectStatus: (state: RootState) => state.municipality.status,
  selectSort: (state: RootState) => state.municipality.sort,
  selectError: (state: RootState) => state.municipality.error,
};

export default municipalitySlice.reducer;
