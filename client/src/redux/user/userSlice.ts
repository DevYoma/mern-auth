import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type InitialStateProp = {
    currentUser: null | {};
    loading: boolean; 
    error: boolean | string;
}

const initialState: InitialStateProp = {
    currentUser: null, 
    loading: false, 
    error: false
}

const userSlice = createSlice({
    name: 'user', 
    initialState, 
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        }, 

        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
        }, 

        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload || false;
        }
    }
})

export const { signInStart, signInFailure, signInSuccess } = userSlice.actions;

export default userSlice.reducer;