import React, { useEffect, useState } from "react";
import MinimizeSidebar from "../components/MinimizeSidebar";
import VideoPlay from "../components/VideoPlay";
import RecommendedVideos from "../components/RecommendedVideos";
import { useParams } from "react-router-dom";
import { getVideoById } from "../api/video";
import Comments from "../components/Comments";

function VideoDetails() {
	const [video, setVideo] = useState({});
	const { videoId } = useParams();

	const getVideoByIdHandler = async () => {
		const result = await getVideoById(videoId);
		setVideo(result);
	};

	useEffect(() => {
		getVideoByIdHandler();
	}, []);

	return (
		<>
			<div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
				<MinimizeSidebar />
				<section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0">
					<div className="flex w-full flex-wrap gap-4 p-4 lg:flex-nowrap">
						<div className="col-span-12 w-full">
							<VideoPlay video={video} />
							<Comments videoId={videoId} />
						</div>
						<RecommendedVideos />
					</div>
				</section>
			</div>
		</>
	);
}

export default VideoDetails;
