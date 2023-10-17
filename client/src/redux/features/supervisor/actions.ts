import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getDates: createAsyncThunk<
    { dates: number[][] },
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("supervisor/dates", async (_, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/supervisor/dates", axiosConfig(getState().user.token))
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getTickets: createAsyncThunk<
    {
      tickets: MiniTicketSupervisor[];
      count: { closing_state: string; count: number }[];
    },
    number[],
    { state: RootState; rejectValue: ErrorType }
  >("supervisor/tickets", async (dates, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/supervisor/tickets", {
          params: {
            startDate: dates[0],
            endDate: dates[1],
          },
          ...axiosConfig(getState().user.token),
        })
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
