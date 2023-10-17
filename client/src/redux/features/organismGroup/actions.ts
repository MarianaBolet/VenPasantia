import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getAllOrganismGroups: createAsyncThunk<
    OrganismGroupType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("organismGroup/get", async (_, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/organismGroup", axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  createOrganismGroup: createAsyncThunk<
    OrganismGroupType,
    Partial<OrganismGroupType>,
    { state: RootState; rejectValue: ErrorType }
  >("organismGroup/post", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.post(
          "/organismGroup",
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  editOrganismGroup: createAsyncThunk<
    OrganismGroupType,
    OrganismGroupType,
    { state: RootState; rejectValue: ErrorType }
  >("organismGroup/put", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/organismGroup/${payload.id}`,
          payload,
          axiosConfig(getState().user.token)
        )
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  deleteOrganismGroup: createAsyncThunk<
    number,
    OrganismGroupType,
    { state: RootState; rejectValue: ErrorType }
  >("organismGroup/delete", async (payload, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `/organismGroup/${payload.id}`,
        axiosConfig(getState().user.token)
      );
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
