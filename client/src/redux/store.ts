import { configureStore } from "@reduxjs/toolkit";
import ccpReducer from "./features/ccp/ccpSlice";
import municipalityReducer from "./features/municipality/municipalitySlice";
import parishReducer from "./features/parish/parishSlice";
import quadrantReducer from "./features/quadrant/quadrantSlice";
import reasonReducer from "./features/reason/reasonSlice";
import organismReducer from "./features/organism/slice";
import organismGroupReducer from "./features/organismGroup/slice";
import supervisorReducer from "./features/supervisor/slice";
import ticketReducer from "./features/ticket/ticketSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
  reducer: {
    ccp: ccpReducer,
    municipality: municipalityReducer,
    organism: organismReducer,
    organismGroup: organismGroupReducer,
    parish: parishReducer,
    quadrant: quadrantReducer,
    reason: reasonReducer,
    supervisor: supervisorReducer,
    ticket: ticketReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
