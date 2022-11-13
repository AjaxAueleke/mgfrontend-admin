import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth";
import { createWrapper } from "next-redux-wrapper";
import { doctorsSlice } from "../features/doctors";

const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [doctorsSlice.name]: doctorsSlice.reducer,
    },
    devTools: true,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
export const wrapper = createWrapper<AppStore>(makeStore);
