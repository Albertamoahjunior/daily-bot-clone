import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthState {
    // email: string | null;
    id: string|null;
    is_admin:  boolean|null;
    token: string|null;
}

const initialState: AuthState = {
    // email: null,
    is_admin:  null,
    id: null,
    token: null,
}

interface ValidUser{
    // email: string;
    id: string;
    token: string;
    is_admin:  boolean;
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        LOGIN: (state , action:PayloadAction<ValidUser>) => {
            state = action.payload ;
        },
        LOGOUT: (state) => {
            state =  initialState ;
        }
    }
})

export const { LOGIN, LOGOUT } = userSlice.actions;

export default userSlice.reducer;