import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllVideos } from "../api/video";
import convertTimeToHHMMSS from "../utils/convertTime";
import timeAgo from "../utils/timeAgo";

function VideoListingCardView() {
	const [allVideos, setAllVideos] = useState([]);

	const getAllVideosHandler = async () => {
		const result = await getAllVideos();
		if (Array.isArray(result)) {
			setAllVideos(result);
			console.log("Videos", result); // Log the updated state here
		}
	};

	useEffect(() => {
		getAllVideosHandler();
		console.log("Videos", allVideos);
	}, []);

	return (
		<>
			<section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
				<div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
					{allVideos?.map((video) => {
						return (
							<Link
								key={video._id}
								to={`/api/v1/videos/${video._id}`}
							>
								<div className="w-full">
									<div className="relative mb-2 w-full pt-[56%]">
										<div className="absolute inset-0">
											<img
												src={video.thumbnail}
												alt={video.title}
												className="w-full h-full"
											/>
										</div>
										<span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
											{convertTimeToHHMMSS(
												video.duration
											)}
										</span>
									</div>
									<div className="flex gap-x-2">
										<div className="w-10 h-10 shrink-0">
											<img
												src={video?.avatar}
												alt={video?.username}
												className="w-full h-full rounded-full"
											/>
										</div>
										<div className="w-full">
											<h6 className="mb-1 font-semibold">
												{video.title}
											</h6>
											<p className="flex text-sm text-gray-200">
												10.3k Views ·{" "}
												{timeAgo(video.createdAt)}
											</p>
											<p className="text-sm text-gray-200">
												{video.fullName}
											</p>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</section>
		</>
	);
}

export default VideoListingCardView;
