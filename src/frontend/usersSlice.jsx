import { createSlice } from "@reduxjs/toolkit"

export const usersSlice = createSlice({
    name: "user",
    initialState: {
        value: null
    },
    reducers: {
        set_user: (state, username) => {
            state.value = username.payload;
        }
    }
})

export const actions = usersSlice.actions;
export const reducer = usersSlice.reducer;