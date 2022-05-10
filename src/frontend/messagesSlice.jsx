import { createSlice } from "@reduxjs/toolkit"

export const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        value: []
    },
    reducers: {
        add_messages: (state, newMessages) => {
            /*
            newMessages.map(
                m => { state.push(m); }
            )
            */

            state.value = newMessages.payload;
        }
    }
})

export const actions = messagesSlice.actions;
export const reducer = messagesSlice.reducer;