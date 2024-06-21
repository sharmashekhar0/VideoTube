import React, { useEffect, useState } from "react";
import { getUserChannelProfile } from "../../api/user";
import { Link, Outlet } from "react-router-dom";
import ChannelVideoList from ".././ChannelVideoList";
import ChannelPlaylist from ".././ChannelPlaylist";
import ChannelTweets from ".././ChannelTweets";
import { toggleSubscription } from "../../api/subscription";
import ChannelSubscribed from ".././ChannelSubscribed";
import MyChannelVideoList from "./MyChannelVideoList";
import MyChannelTweets from "./MyChannelTweets";
import EditPersonalInformation from "./EditPersonalInformation";
import EditChannelInfo from "./EditChannelInfo";
import ChangePassword from "./ChangePassword";
import UploadVideoModalPopup from "../UploadVideoModalPopup";
import SideMenu from "../SideMenu";
import useUploadVideo from "../../hooks/useUploadVideo";

function MyChannel() {
	const [userChannel, setUserChannel] = useState({});
	const [username, setUsername] = useState("");
	const [activeSection, setActiveSection] = useState("videos");
	const [isChannelSubscribed, setIsChannelSubscribed] = useState(false);
	const [avatar, setAvatar] = useState(null);
	const [coverImage, setCoverImage] = useState(null);

	const [edit, setEdit] = useState(false);
	const { isOpen } = useUploadVideo();
	console.log(isOpen);

	const editChangeHandler = () => {
		if (edit) setActiveSection("videos");
		else setActiveSection("personal");
		const editValue = edit;
		setEdit(!editValue);
	};

	const sectionClickHandler = (sectionName) => {
		setActiveSection(sectionName);
	};

	const getUserChannelProfileHandler = async () => {
		const segments = window.location.pathname.split("/");
		const localUsername = segments.pop();
		setUsername(localUsername);
		const result = await getUserChannelProfile(localUsername);
		setUserChannel(result);
		console.log("User Channel :: ", result);
		setIsChannelSubscribed(result?.isSubscribed);
	};

	const toggleSubscriptionHandler = async () => {
		try {
			const channelId = userChannel?._id;
			const response = await toggleSubscription(channelId);
			console.log("Subscribe Toggle Response :: ", response);
			if (response.message === "Channel subscribed successfully") {
				setIsChannelSubscribed(true);
			} else {
				setIsChannelSubscribed(false);
			}
		} catch (error) {
			console.log("Error while toggling subscribe :: ", error);
		}
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0]; // Get the first selected file
		if (file) {
			setAvatar(file);
		}
	};

	const handleCoverImageChange = (e) => {
		const file = e.target.files[0]; // Get the first selected file
		if (file) {
			setCoverImage(file);
		}
	};

	useEffect(() => {
		getUserChannelProfileHandler();
	}, []);

	useEffect(() => {
		console.log("User Channel :: ", userChannel);
	}, []);

	return (
		<div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
			<SideMenu />
			<section className="w-full relative pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
				<div className="relative min-h-[150px] w-full pt-[16.28%]">
					<div className="absolute inset-0 overflow-hidden">
						<img
							src={userChannel?.coverImage}
							alt="cover-photo"
							className="object-cover w-full h-full"
						/>
						{edit && (
							<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
								<input
									type="file"
									id="cover-image"
									class="hidden"
									onChange={handleCoverImageChange}
								/>
								<label
									for="cover-image"
									class="inline-block h-8 w-8 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
										></path>
									</svg>
								</label>
							</div>
						)}
					</div>
				</div>
				<div className="px-4 pb-4">
					<div className="flex flex-wrap gap-4 pb-4 pt-6">
						<span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2">
							<img
								src={userChannel?.avatar}
								alt="Channel"
								className="h-full w-full object-cover"
							/>
							{edit && (
								<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
									<input
										type="file"
										id="profile-image"
										class="hidden"
										onChange={handleAvatarChange}
									/>
									<label
										for="profile-image"
										class="inline-block h-8 w-8 cursor-pointer rounded-lg bg-white/60 p-1 text-[#ae7aff] hover:bg-white"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
											></path>
										</svg>
									</label>
								</div>
							)}
						</span>
						<div className="mr-auto inline-block">
							<h1 className="font-bolg text-xl">
								{userChannel?.fullName}
							</h1>
							<p className="text-sm text-gray-400">
								@{userChannel?.username}
							</p>
							<p className="text-sm text-gray-400">
								{userChannel?.subscriberCount} Subscribers
							</p>
						</div>
						{!edit ? (
							<div class="inline-block">
								<button
									onClick={editChangeHandler}
									class="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
								>
									<span class="inline-block w-5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="2"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
											></path>
										</svg>
									</span>
									Edit
								</button>
							</div>
						) : (
							<div
								class="inline-block"
								onClick={editChangeHandler}
							>
								<button class="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
									View channel
								</button>
							</div>
						)}
					</div>
					{!edit ? (
						<ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
							<li
								onClick={() => sectionClickHandler("videos")}
								className="w-full"
							>
								<button
									className={`w-full border-b-2 px-3 py-1.5 ${
										activeSection === "videos"
											? "border-[#ae7aff] bg-white text-[#ae7aff]"
											: "border-transparent text-gray-400"
									} `}
								>
									Videos
								</button>
							</li>
							<li
								onClick={() => sectionClickHandler("playlist")}
								className="w-full"
							>
								<button
									className={`w-full border-b-2 px-3 py-1.5 ${
										activeSection === "playlist"
											? "border-[#ae7aff] bg-white text-[#ae7aff]"
											: "border-transparent text-gray-400"
									} `}
								>
									Playlist
								</button>
							</li>
							<li
								onClick={() => sectionClickHandler("tweets")}
								className="w-full"
							>
								<button
									className={`w-full border-b-2 px-3 py-1.5 ${
										activeSection === "tweets"
											? "border-[#ae7aff] bg-white text-[#ae7aff]"
											: "border-transparent text-gray-400"
									} `}
								>
									Tweets
								</button>
							</li>
							<li
								onClick={() =>
									sectionClickHandler("subscribed")
								}
								className="w-full"
							>
								<button
									className={`w-full border-b-2 px-3 py-1.5 ${
										activeSection === "subscribed"
											? "border-[#ae7aff] bg-white text-[#ae7aff]"
											: "border-transparent text-gray-400"
									} `}
								>
									Subscribed
								</button>
							</li>
						</ul>
					) : (
						<ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row gap-x-2 overflow-auto border-b-2 border-gray-400 bg-[#121212] py-2 sm:top-[82px]">
							<li
								onClick={() => sectionClickHandler("personal")}
								className="w-full"
							>
								<button
									className={`w-full border-b-2 px-3 py-1.5 ${
										activeSection === "personal"
											? "border-[#ae7aff] bg-white text-[#ae7aff]"
											: "border-transparent text-gray-400"
									} `}
								>
									Personal Information
								</button>
							</li>
							{/* <li
								onClick={() => sectionClickHandler("channel")}
								className="w-full"
							>
								<button
									className={`w-full border-b-2 px-3 py-1.5 ${
										activeSection === "channel"
											? "border-[#ae7aff] bg-white text-[#ae7aff]"
											: "border-transparent text-gray-400"
									} `}
								>
									Channel Information
								</button>
							</li> */}
							<li
								onClick={() => sectionClickHandler("password")}
								className="w-full"
							>
								<button
									className={`w-full border-b-2 px-3 py-1.5 ${
										activeSection === "password"
											? "border-[#ae7aff] bg-white text-[#ae7aff]"
											: "border-transparent text-gray-400"
									} `}
								>
									Change Password
								</button>
							</li>
						</ul>
					)}
					{isOpen && <UploadVideoModalPopup />}
					{activeSection === "videos" && <MyChannelVideoList />}
					{activeSection === "playlist" && <ChannelPlaylist />}
					{activeSection === "tweets" && <MyChannelTweets />}
					{activeSection === "personal" && (
						<EditPersonalInformation
							avatar={avatar}
							coverImage={coverImage}
						/>
					)}
					{activeSection === "channel" && <EditChannelInfo />}
					{activeSection === "password" && <ChangePassword />}
					{activeSection === "subscribed" && (
						<ChannelSubscribed
							subscribedTo={userChannel?.channelSubscribedTo}
						/>
					)}
				</div>
			</section>
		</div>
	);
}

export default MyChannel;
