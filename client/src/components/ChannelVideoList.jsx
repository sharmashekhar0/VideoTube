import React, { useEffect, useState } from "react";
import convertTime from "../utils/convertTime";
import timeAgo from "../utils/timeAgo";
import { Link } from "react-router-dom";
import { getUserChannelProfile } from "../api/user";

function ChannelVideoList({ userChannel }) {
	const [channelVideos, setChannelVideos] = useState([]);

	const getAllChannelVideosHandler = async () => {
		const pathname = window.location.pathname;
		const pathParts = pathname.split("/");
		const username = pathParts[5];
		const allVideos = await getUserChannelProfile(username);
		setChannelVideos(allVideos?.videos);
	};

	useEffect(() => {
		getAllChannelVideosHandler();
	});
	return (
		<>
			<div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 pt-2">
				{channelVideos?.map((video) => {
					return (
						<Link
							key={video._id}
							to={`/api/v1/videos/${video._id}`}
						>
							<div className="w-full">
								<div className="relative mb-2 w-full pt-[56%]">
									<div className="absolute inset-0">
										<img
											src={video?.thumbnail}
											alt="JavaScript Fundamentals: Variables and Data Types"
											className="h-full w-full"
										/>
									</div>
									<span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
										{convertTime(video?.duration)}
									</span>
								</div>
								<h6 className="mb-1 font-semibold">
									{video?.title}
								</h6>
								<p className="flex text-sm text-gray-200">
									10.3k Views · {timeAgo(video?.createdAt)}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</>
	);
}

export default ChannelVideoList;
