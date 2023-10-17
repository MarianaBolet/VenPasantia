import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getAllQuadrants: createAsyncThunk<
    QuadrantType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/getAll", async (_, { rejectWithValue, getState }) => {
    try {
      return (await axios.get("/quadrant", axiosConfig(getState().user.token)))
        .data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getQuadrantsByName: createAsyncThunk<
    QuadrantType[],
    string,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/getByName", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/quadrant", {
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
  getQuadrantsByCCP: createAsyncThunk<
    QuadrantType[],
    number,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/getByCCP", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/quadrant/ccp", {
          ...axiosConfig(getState().user.token),
          params: {
            ccpId: payload,
          },
        })
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getQuadrantsByParish: createAsyncThunk<
    QuadrantType[],
    number,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/getByParish", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/quadrant/parish", {
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
  getQuadrantById: createAsyncThunk<
    QuadrantType,
    number,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/getById", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get(
          `/quadrant/${payload}`,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  createQuadrant: createAsyncThunk<
    QuadrantType,
    Partial<QuadrantType>,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/post", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.post(
          "/quadrant",
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  editQuadrant: createAsyncThunk<
    QuadrantType,
    Partial<QuadrantType>,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/put", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/quadrant/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  deleteQuadrant: createAsyncThunk<
    number,
    QuadrantType,
    { state: RootState; rejectValue: ErrorType }
  >("quadrant/delete", async (payload, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `/quadrant/${payload.id}`,
        axiosConfig(getState().user.token)
      );
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
