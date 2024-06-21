import React from "react";
import Header from "./components/Header";
import { Outlet } from "react-router";
import { Flip, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	return (
		<div className="h-screen overflow-y-auto bg-[#121212] text-white">
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				transition:Slide
			/>
			<Header />
			<Outlet />
			{/* <EditVideoModalPopup /> */}

			{/* <EditChannelInfo /> */}
			{/* <UploadVideoModalPopup /> */}
		</div>
	);
}

export default App;
