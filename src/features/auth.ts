import { AsyncThunk, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

export interface AuthState {
  authState: boolean;
  user: {
    name?: string;
    email?: string;
    phone?: string;
  };
  userStateLoading: boolean;
}

const initialState: AuthState = {
  authState: false,
  user: {},
  userStateLoading: false,
};
export const fetchUserDetails: any = createAsyncThunk(
  "auth/fetchUserDetails",
  async (token: string, thunkAPI ) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/curuserinfo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.json();
  }
);
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.authState = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state: AuthState, action: { payload: { auth: any } }) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
    [fetchUserDetails.pending]: (state) => {
      state.userStateLoading = true;
    },
    [fetchUserDetails.fulfilled]: (state, action) => {
      state.userStateLoading = false;
      console.log("ACTION");
      console.log(action);
      state.user = action.payload.data;
    },
    [fetchUserDetails.rejected]: (state) => {
      state.userStateLoading = false;
      state.user = {};
    },
  },
});

export const { setAuthState, setUser } = authSlice.actions;
export const selectAuthState = (state: any) => state.auth.authState;
export const selectUserState = (state: any) => state.auth.user;
export default authSlice.reducer;
