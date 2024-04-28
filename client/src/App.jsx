import React from "react";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import NoVideoAvailable from "./components/NoVideoAvailable";
import { Outlet } from "react-router";
import UploadVideoModalPopup from "./components/UploadVideoModalPopup";
import EditPersonalInformation from "./components/EditPersonalInformation";
import EditChannelInfo from "./components/EditChannelInfo";
import EditVideoModalPopup from "./components/EditVideoModalPopup";

function App() {
	return (
		<div className="h-screen overflow-y-auto bg-[#121212] text-white">
			<Header />
			<Outlet />
			{/* <EditVideoModalPopup /> */}

			{/* <EditChannelInfo /> */}
			{/* <UploadVideoModalPopup /> */}
		</div>
	);
}

export default App;
