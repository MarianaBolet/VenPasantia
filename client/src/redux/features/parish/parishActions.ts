import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getAllParishes: createAsyncThunk<
    ParishType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("parish/getAll", async (_, { rejectWithValue, getState }) => {
    try {
      return (await axios.get("/parish", axiosConfig(getState().user.token)))
        .data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getParishesByName: createAsyncThunk<
    ParishType[],
    string,
    { state: RootState; rejectValue: ErrorType }
  >("parish/getByName", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/parish", {
          ...axiosConfig(getState().user.token),
          params: {
            name: payload,
          },
        })
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getParishesByMunicipality: createAsyncThunk<
    ParishType[],
    number,
    { state: RootState; rejectValue: ErrorType }
  >(
    "parish/getByMunicipality",
    async (payload, { rejectWithValue, getState }) => {
      try {
        return (
          await axios.get("/parish/municipality", {
            ...axiosConfig(getState().user.token),
            params: {
              municipalityId: payload,
            },
          })
        ).data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
  ),
  getParishById: createAsyncThunk<
    ParishType,
    number,
    { state: RootState; rejectValue: ErrorType }
  >("parish/getById", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get(
          `/parish/${payload}`,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  createParish: createAsyncThunk<
    ParishType,
    Partial<ParishType>,
    { state: RootState; rejectValue: ErrorType }
  >("parish/post", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.post("/parish", payload, axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  editParish: createAsyncThunk<
    ParishType,
    Partial<ParishType>,
    { state: RootState; rejectValue: ErrorType }
  >("parish/put", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/parish/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  deleteParish: createAsyncThunk<
    number,
    ParishType,
    { state: RootState; rejectValue: ErrorType }
  >("parish/delete", async (payload, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `/parish/${payload.id}`,
        axiosConfig(getState().user.token)
      );
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
