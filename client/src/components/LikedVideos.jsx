import React, { useEffect, useState } from "react";
import { getLikedVideos } from "../api/like";
import NoVideoAvailable from "./NoVideoAvailable";
import { Link } from "react-router-dom";
import convertTimeToHHMMSS from "../utils/convertTime";
import timeAgo from "../utils/timeAgo";
import formatNumberIndianSystem from "../utils/formatNumberIndianSystem";

function LikedVideos() {
	const [likedVideos, setLikedVideos] = useState([]);

	const getLikedVideosHandler = async () => {
		try {
			const response = await getLikedVideos();
			console.log(response?.data);
			setLikedVideos(response?.data?.likedVideos);
		} catch (error) {
			console.log("Error while getting liked videos :: ", error);
		}
	};

	useEffect(() => {
		getLikedVideosHandler();
	}, []);

	return (
		<>
			{!likedVideos ? (
				<NoVideoAvailable />
			) : (
				<section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
						{likedVideos?.map((video) => {
							console.log(video);
							return (
								<Link
									key={video?.video_details?._id}
									to={`/api/v1/videos/${video?.video_details?._id}`}
								>
									<div className="w-full">
										<div className="relative mb-2 w-full pt-[56%]">
											<div className="absolute inset-0">
												<img
													src={
														video?.video_details
															?.thumbnail
													}
													alt={
														video?.video_details
															?.title
													}
													className="w-full h-full"
												/>
											</div>
											<span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
												{convertTimeToHHMMSS(
													video?.video_details
														?.duration
												)}
											</span>
										</div>
										<div className="flex gap-x-2">
											<div className="w-10 h-10 shrink-0">
												<img
													src={
														video?.video_details
															?.owner_details
															?.avatar
													}
													alt={
														video?.video_details
															?.owner_details
															?.username
													}
													className="w-full h-full rounded-full object-cover"
												/>
											</div>
											<div className="w-full">
												<h6 className="mb-1 font-semibold">
													{
														video?.video_details
															?.title
													}
												</h6>
												<p className="flex text-sm text-gray-200">
													{formatNumberIndianSystem(
														video?.video_details
															?.views
													) || 0}{" "}
													Views ·{" "}
													{timeAgo(
														video?.video_details
															?.createdAt
													)}
												</p>
												<p className="text-sm text-gray-200">
													{
														video?.video_details
															?.owner_details
															?.fullName
													}
												</p>
											</div>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</section>
			)}
		</>
	);
}

export default LikedVideos;
