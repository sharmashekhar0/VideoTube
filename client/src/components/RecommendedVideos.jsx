import React, { useEffect, useState } from "react";
import { getAllVideos } from "../api/video";
import { Link } from "react-router-dom";
import convertTimeToHHMMSS from "../utils/convertTime";
import timeAgo from "../utils/timeAgo";
import formatNumberIndianSystem from "../utils/formatNumberIndianSystem";

function RecommendedVideos({ currentVideoId }) {
	const [recommendedVideos, setRecommendedVideos] = useState([]);
	const getAllVideosHandler = async () => {
		try {
			const response = await getAllVideos();
			const recommended = response.filter(
				(video) => video._id !== currentVideoId // Filter out the current video
			);
			console.log(currentVideoId);
			console.log(recommended);
			setRecommendedVideos(recommended);
		} catch (error) {
			console.log("Error while getting all videos :: ", error);
		}
	};

	useEffect(() => {
		getAllVideosHandler();
	}, [currentVideoId]);

	return (
		<div className="col-span-12 flex w-full shrink-0 flex-col gap-3 lg:w-[350px] xl:w-[400px]">
			{recommendedVideos?.map((video) => (
				<Link key={video._id} to={`/api/v1/videos/r/${video?._id}`}>
					<div className="w-full gap-x-2 border pr-2 md:flex">
						<div className="relative mb-2 w-full md:mb-0 md:w-5/12">
							<div className="w-full pt-[56%]">
								<div className="absolute inset-0">
									<img
										src={video?.thumbnail}
										className="h-full w-full"
									/>
								</div>
								<span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
									{convertTimeToHHMMSS(video?.duration)}
								</span>
							</div>
						</div>
						<div className="flex gap-x-2 px-2 pb-4 pt-1 md:w-7/12 md:px-0 md:py-0.5">
							<div className="h-12 w-12 shrink-0 md:hidden">
								<img
									src={video?.thumbnail}
									className="h-full w-full rounded-full"
								/>
							</div>
							<div className="w-full pt-1 md:pt-0">
								<h6 className="mb-1 text-sm font-semibold">
									{video?.title}
								</h6>
								<p className="mb-0.5 mt-2 text-sm text-gray-200">
									{video.fullName}
								</p>
								<p className="flex text-sm text-gray-200">
									{formatNumberIndianSystem(video?.views) ||
										0}{" "}
									 Views · {timeAgo(video.createdAt)}
								</p>
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}

export default RecommendedVideos;
