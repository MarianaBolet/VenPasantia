import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getAllCCPs: createAsyncThunk<
    CCPType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("ccp/getAll", async (_, { rejectWithValue, getState }) => {
    try {
      return (await axios.get("/ccp", axiosConfig(getState().user.token))).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getCCPsByName: createAsyncThunk<
    CCPType[],
    string,
    { state: RootState; rejectValue: ErrorType }
  >("ccp/getByName", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/ccp", {
          ...axiosConfig(getState().user.token),
          data: {
            name: payload,
          },
        })
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getCCPsByParish: createAsyncThunk<
    CCPType[],
    number,
    { state: RootState; rejectValue: ErrorType }
  >("ccp/getByParish", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/ccp/parish", {
          ...axiosConfig(getState().user.token),
          params: {
            parishId: payload,
          },
        })
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getCCPById: createAsyncThunk<
    CCPType,
    number,
    { state: RootState; rejectValue: ErrorType }
  >("ccp/getById", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get(`/ccp/${payload}`, axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  createCCP: createAsyncThunk<
    CCPType,
    Partial<CCPType>,
    { state: RootState; rejectValue: ErrorType }
  >("ccp/post", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.post("/ccp", payload, axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  editCCP: createAsyncThunk<
    CCPType,
    Partial<CCPType>,
    { state: RootState; rejectValue: ErrorType }
  >("ccp/put", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/ccp/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  deleteCCP: createAsyncThunk<
    number,
    CCPType,
    { state: RootState; rejectValue: ErrorType }
  >("ccp/delete", async (payload, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `/ccp/${payload.id}`,
        axiosConfig(getState().user.token)
      );
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
