import React, { useEffect, useState } from "react";
import { getPlaylistById, getUserPlaylists } from "../api/playlist";
import timeAgo from "../utils/timeAgo";
import formatNumberIndianSystem from "../utils/formatNumberIndianSystem";
import convertTime from "../utils/convertTime";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import playlistThumbnail from "../assets/playlistThumbnail.jpg";

function ChannelPlaylistVideos() {
	const [playlistVideos, setPlaylistVideos] = useState([]);
	const [playlist, setPlaylist] = useState({});
	const [totalViews, setTotalViews] = useState(0);
	const currentChannel = useSelector(
		(state) => state?.currentChannel?.currentChannel
	);
	console.log(currentChannel);
	const getPlaylistVideosHandler = async () => {
		try {
			const playlistId = window.location.pathname.split("/")[4];
			console.log(playlistId);
			const response = await getPlaylistById(playlistId);
			console.log(playlist);
			setPlaylist(response?.data?.playlist);
			setPlaylistVideos(response?.data?.playlist?.videos);
			console.log(response?.data?.playlist?.ownerDetails);
		} catch (error) {
			console.log("Error while getting playlist videos :: ", error);
		}
	};

	useEffect(() => {
		getPlaylistVideosHandler();
	}, []);

	useEffect(() => {
		let totalPlaylistViewsCount = 0;
		playlistVideos?.map((video) => {
			totalPlaylistViewsCount += video?.views || 0;
		});
		setTotalViews(totalPlaylistViewsCount);
	}, [playlistVideos]);

	return (
		<>
			<section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
				<div className="flex flex-wrap gap-x-4 gap-y-10 p-4 xl:flex-nowrap">
					<div className="w-full shrink-0 sm:max-w-md xl:max-w-sm">
						<div className="relative mb-2 w-full pt-[56%]">
							<div className="absolute inset-0">
								<img
									src={playlistThumbnail}
									alt="React Mastery"
									className="h-full w-full"
								/>
								<div className="absolute inset-x-0 bottom-0">
									<div className="relative border-t bg-white/30 p-4 text-white backdrop-blur-sm before:absolute before:inset-0 before:bg-black/40">
										<div className="relative z-[1]">
											<p className="flex justify-between">
												<span className="inline-block">
													Playlist
												</span>
												<span className="inline-block">
													{playlistVideos?.length}{" "}
													 videos
												</span>
											</p>
											<p className="text-sm text-gray-200">
												{totalViews} Views · {""}
												{timeAgo(playlist?.createdAt)}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<h6 className="mb-1 font-semibold">{playlist.name}</h6>
						<p className="flex text-sm text-gray-200">
							{playlist?.description}
						</p>
						<div className="mt-6 flex items-center gap-x-3">
							<div className="h-16 w-16 shrink-0">
								<img
									src={playlist?.ownerDetails?.avatar}
									alt="React Patterns"
									className="h-full w-full rounded-full object-cover"
								/>
							</div>
							<div className="w-full">
								<h6 className="font-semibold">
									{playlist?.ownerDetails?.fullName}
								</h6>
								<p className="text-sm text-gray-300">
									{currentChannel?.subscriberCount}{" "}
									Subscribers
								</p>
							</div>
						</div>
					</div>
					<div className="flex w-full flex-col gap-y-4">
						{playlistVideos?.map((video) => {
							console.log(video);
							return (
								<Link
									key={video?._id}
									to={`/api/v1/videos/${video._id}`}
								>
									<div className="border">
										<div className="w-full max-w-3xl gap-x-4 sm:flex">
											<div className="relative mb-2 w-full sm:mb-0 sm:w-5/12">
												<div className="w-full pt-[56%]">
													<div className="absolute inset-0">
														<img
															src={
																video?.thumbnail
															}
															alt={video?.title}
															className="h-full w-full"
														/>
													</div>
													<span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
														{convertTime(
															video?.duration
														)}
													</span>
												</div>
											</div>
											<div className="flex gap-x-2 px-2 sm:w-7/12 sm:px-0">
												<div className="h-10 w-10 shrink-0 sm:hidden">
													<img
														src="https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
														alt="codemaster"
														className="h-full w-full rounded-full"
													/>
												</div>
												<div className="w-full">
													<h6 className="mb-1 font-semibold sm:max-w-[75%]">
														{video?.title}
													</h6>
													<p className="flex text-sm text-gray-200 sm:mt-3">
														{formatNumberIndianSystem(
															video?.views
														) || 0}{" "}
														Views · 44 minutes ago
													</p>
													<div className="flex items-center gap-x-4">
														<div className="mt-2 hidden h-10 w-10 shrink-0 sm:block">
															<img
																src={
																	video?.owner
																		?.avatar
																}
																alt="codemaster"
																className="h-full w-full rounded-full object-cover"
															/>
														</div>
														<p className="text-sm text-gray-200">
															{
																video?.owner
																	?.fullName
															}
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>
		</>
	);
}

export default ChannelPlaylistVideos;
