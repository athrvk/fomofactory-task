import { SocketState } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SocketState = {
    isSocketConnected: false,
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setIsSocketConnected: (state: SocketState, action: PayloadAction<boolean>) => {
            state.isSocketConnected = action.payload;
        }
    },
});

export const { setIsSocketConnected } = socketSlice.actions;
export default socketSlice.reducer;