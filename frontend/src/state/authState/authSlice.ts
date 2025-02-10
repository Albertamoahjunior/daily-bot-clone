import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
    email: string | null;
    userId: string|null;
    token: string|null;
}

const initialState: AuthState = {
    email: null,
    userId: null,
    token: null,
}

interface ValidUser{
    email: string;
    userId: string;
    token: string;
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        LOGIN: (state , action:PayloadAction<ValidUser>) => {
            state = action.payload ;
        },
        LOGOUT: (state) => {
            state.userId =  null ;
            state.email = null;
        }
    }
})

export const { LOGIN, LOGOUT } = userSlice.actions;

export default userSlice.reducer;