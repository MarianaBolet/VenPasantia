import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getAllReasons: createAsyncThunk<
    ReasonType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("reason/getAll", async (_, { rejectWithValue, getState }) => {
    try {
      return (await axios.get("/reason", axiosConfig(getState().user.token)))
        .data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getReasonsByName: createAsyncThunk<
    ReasonType[],
    string,
    { state: RootState; rejectValue: ErrorType }
  >("reason/getByName", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/reason", {
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
  getReasonById: createAsyncThunk<
    ReasonType,
    number,
    { state: RootState; rejectValue: ErrorType }
  >("reason/getById", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get(
          `/reason/${payload}`,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  createReason: createAsyncThunk<
    ReasonType,
    Partial<ReasonType>,
    { state: RootState; rejectValue: ErrorType }
  >("reason/post", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.post("/reason", payload, axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  editReason: createAsyncThunk<
    ReasonType,
    ReasonType,
    { state: RootState; rejectValue: ErrorType }
  >("reason/put", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/reason/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  deleteReason: createAsyncThunk<
    number,
    ReasonType,
    { state: RootState; rejectValue: ErrorType }
  >("reason/delete", async (payload, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `/reason/${payload.id}`,
        axiosConfig(getState().user.token)
      );
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
