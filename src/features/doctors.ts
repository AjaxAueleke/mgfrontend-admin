import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { IDoctor } from "../pages/doctor";

export interface DoctorsState {
  doctors: Array<IDoctor>;
}

const initialState: DoctorsState = {
  doctors: [],
};
export const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (state: DoctorsState, action) => {
      state.doctors = [...action.payload];
    },
  },
  extraReducers: {
    [HYDRATE]: (state: DoctorsState, action: { payload: { auth: any } }) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setDoctors } = doctorsSlice.actions;
export const selectDoctors = (state: any) => state.doctors;
export default doctorsSlice.reducer;
