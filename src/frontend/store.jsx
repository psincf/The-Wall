import { configureStore } from "@reduxjs/toolkit";

import { messagesSlice } from "./messagesSlice.jsx";
import { usersSlice } from "./usersSlice.jsx";

export const store = configureStore({
    reducer: {
        messages: messagesSlice.reducer,
        user: usersSlice.reducer,
    },
})