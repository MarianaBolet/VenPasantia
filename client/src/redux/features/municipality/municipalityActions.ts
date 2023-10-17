import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getAllMunicipalities: createAsyncThunk<
    MunicipalityType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("municipality/getAll", async (_, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/municipality", axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getMunicipalitiesByName: createAsyncThunk<
    MunicipalityType[],
    string,
    { state: RootState; rejectValue: ErrorType }
  >(
    "municipality/getByName",
    async (payload, { rejectWithValue, getState }) => {
      try {
        return (
          await axios.get("/municipality", {
            ...axiosConfig(getState().user.token),
            data: {
              name: payload,
            },
          })
        ).data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  ),
  getMunicipalityById: createAsyncThunk<
    MunicipalityType,
    number,
    { state: RootState; rejectValue: ErrorType }
  >("municipality/getById", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get(
          `/municipality/${payload}`,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  createMunicipality: createAsyncThunk<
    MunicipalityType,
    Partial<MunicipalityType>,
    { state: RootState; rejectValue: ErrorType }
  >("municipality/post", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.post(
          "/municipality",
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  editMunicipality: createAsyncThunk<
    MunicipalityType,
    MunicipalityType,
    { state: RootState; rejectValue: ErrorType }
  >("municipality/put", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/municipality/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  deleteMunicipality: createAsyncThunk<
    number,
    MunicipalityType,
    { state: RootState; rejectValue: ErrorType }
  >("municipality/delete", async (payload, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `/municipality/${payload.id}`,
        axiosConfig(getState().user.token)
      );
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
