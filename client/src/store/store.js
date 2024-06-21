import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uploadVideoReducer from "./uploadVideoSlice";
import currentChannelReducer from "./currentChannelSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		uploadVideo: uploadVideoReducer,
		currentChannel: currentChannelReducer,
	},
});

export default store;
