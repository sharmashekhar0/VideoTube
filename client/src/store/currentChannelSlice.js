import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentChannel: null,
};

const currentChannelSlice = createSlice({
	name: "currentChannel",
	initialState,
	reducers: {
		addCurrentChannel: (state, action) => {
			state.currentChannel = action.payload;
		},
	},
});

export const { addCurrentChannel } = currentChannelSlice.actions;

export default currentChannelSlice.reducer;
