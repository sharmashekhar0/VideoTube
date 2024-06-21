import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	status: false,
};

const uploadVideoSlice = createSlice({
	name: "uploadVideo",
	initialState,
	reducers: {
		onOpen: (state, action) => {
			state.status = true;
		},
		onClose: (state) => {
			state.status = false;
		},
		onToggle: (state) => {
			state.isOpen = !state.isOpen;
		},
	},
});

export const { onOpen, onClose, onToggle } = uploadVideoSlice.actions;

export default uploadVideoSlice.reducer;
