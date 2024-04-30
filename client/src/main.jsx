import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SideMenu from "./components/SideMenu.jsx";
import NoVideoAvailable from "./components/NoVideoAvailable.jsx";
import VideoListingCardView from "./components/VideoListingCardView.jsx";
import VideoDetails from "./pages/VideoDetails.jsx";
import Channel from "./components/Channel.jsx";
import ChannelVideoList from "./components/ChannelVideoList.jsx";
import ChannelPlaylist from "./components/ChannelPlaylist.jsx";
import ChannelTweets from "./components/ChannelTweets.jsx";
import ChannelSubscribed from "./components/ChannelSubscribed.jsx";
import UploadVideoModalPopup from "./components/UploadVideoModalPopup.jsx";
import MyChannelTweets from "./components/MyChannelTweets.jsx";
import EditChannelInfo from "./components/EditChannelInfo.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route
				path="/"
				element={
					<div className="flex">
						<SideMenu />
						<VideoListingCardView />
					</div>
				}
			/>
			<Route path="/api/v1/users/login" element={<Login />} />
			<Route path="/api/v1/users/register" element={<Register />} />
			<Route
				path="/api/v1/videos/:videoId"
				element={<VideoDetails />}
			></Route>
			<Route path="/api/v1/users/c/:username" element={<Channel />}>
				<Route
					path="/api/v1/users/c/:username/videos"
					element={<ChangePassword />}
				></Route>
				<Route
					path="/api/v1/users/c/:username/playlist"
					element={<ChannelPlaylist />}
				></Route>
				<Route
					path="/api/v1/users/c/:username/tweets"
					element={<MyChannelTweets />}
				></Route>
				<Route
					path="/api/v1/users/c/:username/subscribed"
					element={<ChannelSubscribed />}
				></Route>
			</Route>
			<Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<RouterProvider router={router}></RouterProvider>
	</Provider>
);
