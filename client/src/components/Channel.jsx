import React, { useEffect, useState } from "react";
import { getUserChannelProfile } from "../api/user";
import { Link, Outlet, useParams } from "react-router-dom";
import ChannelVideoList from "./ChannelVideoList";
import ChannelPlaylist from "./ChannelPlaylist";
import ChannelTweets from "./ChannelTweets";
import {
	getChannelSubscriberById,
	toggleSubscription,
} from "../api/subscription";
import ChannelSubscribed from "./ChannelSubscribed";
import SideMenu from "./SideMenu";
import { useDispatch } from "react-redux";
import { addCurrentChannel } from "../store/currentChannelSlice";
import { FadeLoader, ClipLoader, ClimbingBoxLoader } from "react-spinners";

const override = {
	display: "block",
	position: "fixed",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	zIndex: 9999, // Ensure it appears above other content
	borderColor: "red",
};

function Channel() {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const [userChannel, setUserChannel] = useState({});
	const [username, setUsername] = useState("");
	const [activeSection, setActiveSection] = useState("videos");
	const [isChannelSubscribed, setIsChannelSubscribed] = useState(false);
	const { username: Username } = useParams();
	const sectionClickHandler = (sectionName) => {
		setActiveSection(sectionName);
	};

	const getUserChannelProfileHandler = async (localUsername) => {
		try {
			const result = await getUserChannelProfile(localUsername);
			setUserChannel(result);
			dispatch(addCurrentChannel(result));
			console.log("User Channel :: ", result);
			setIsChannelSubscribed(result?.isSubscribed);
		} catch (error) {
			console.log("Error while fetching user channel :: ", error);
		}
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

	const getChannelSubscriberByIdHandler = async () => {
		try {
			console.log(userChannel?._id);
			const res = await getChannelSubscriberById(userChannel?._id);
			console.log(res);
			if (res?.statusCode === 200) {
				setIsChannelSubscribed(res?.data?.isSubscribed);
			}
		} catch (error) {
			console.log("Error while getting channel subscriber :: ", error);
		}
	};

	useEffect(() => {
		if (Username) {
			setUsername(Username);
		}
	}, [Username]);

	useEffect(() => {
		if (username) {
			getUserChannelProfileHandler(username);
		}
	}, [username]);

	useEffect(() => {
		if (userChannel?._id) {
			getChannelSubscriberByIdHandler();
		}
	}, [userChannel?._id]);

	return (
		<div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
			<SideMenu />
			<section className="w-full relative pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
				<div className="relative min-h-[150px] w-full pt-[16.28%]">
					<div className="absolute inset-0 overflow-hidden">
						<img src={userChannel?.coverImage} alt="cover-photo" />
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
						<div
							className="inline-block"
							onClick={toggleSubscriptionHandler}
						>
							<div className="inline-flex min-w-[145px] justify-end">
								<button className="group/btn mr-1 flex w-full items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto">
									<span className="inline-block w-5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="2"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
											></path>
										</svg>
									</span>
									<span className="group-focus/btn">
										{isChannelSubscribed
											? "Subscribed"
											: "Subscribe"}
									</span>
								</button>
							</div>
						</div>
					</div>
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
							onClick={() => sectionClickHandler("subscribed")}
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
					{activeSection === "videos" && <ChannelVideoList />}
					{activeSection === "playlist" && <ChannelPlaylist />}
					{activeSection === "tweets" && <ChannelTweets />}
					{activeSection === "subscribed" && (
						<ChannelSubscribed
							subscribedTo={userChannel?.channelSubscribedTo}
						/>
					)}
				</div>
				<FadeLoader
					color={"hsla(324, 51%, 67%, 1)"}
					loading={isLoading}
					cssOverride={override}
					size={35}
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			</section>
		</div>
	);
}

export default Channel;
