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
import VideoListingCardView from "./components/VideoListingCardView.jsx";
import VideoDetails from "./pages/VideoDetails.jsx";
import Channel from "./components/Channel.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import ChannelPlaylistVideos from "./components/ChannelPlaylistVideos.jsx";
import LikedVideos from "./components/LikedVideos.jsx";
import WatchHistory from "./components/WatchHistory.jsx";
import MyChannel from "./components/MyChannel/MyChannel.jsx";
import RecommendedVideoDetails from "./pages/RecommendedVideoDetails.jsx";
import ChannelSubscribers from "./components/ChannelSubscribers.jsx";
import Temp from "./components/Temp.jsx";

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
			<Route
				path="/api/v1/videos/r/:videoId"
				element={<RecommendedVideoDetails />}
			></Route>
			<Route
				path="/api/v1/users/c/:username"
				element={<Channel />}
			></Route>
			<Route
				path="/api/v1/users/my-channel/:username"
				element={<MyChannel />}
			></Route>
			<Route
				path="/api/v1/users/channel/subscribers/"
				element={<ChannelSubscribers />}
			></Route>
			<Route
				path="/api/v1/playlists/:playlistId"
				element={
					<div className="flex">
						<SideMenu />
						<ChannelPlaylistVideos />
					</div>
				}
			></Route>
			<Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
			<Route
				path="/liked-videos"
				element={
					<div className="flex">
						<SideMenu />
						<LikedVideos />
					</div>
				}
			></Route>
			<Route
				path="/watch-history"
				element={
					<div className="flex">
						<SideMenu />
						<WatchHistory />
					</div>
				}
			></Route>
		</Route>
	)
);

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<RouterProvider router={router}></RouterProvider>
	</Provider>
);
