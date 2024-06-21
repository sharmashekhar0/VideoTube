import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Import Video.js CSS
import "@videojs/themes/dist/fantasy/index.css"; // Example theme

const VideoPlayer = ({ options }) => {
	const videoRef = useRef(null);
	const playerRef = useRef(null);

	useEffect(() => {
		// Initialize the Video.js player
		playerRef.current = videojs(videoRef.current, options, () => {
			console.log("Player is ready");
		});

		return () => {
			// Destroy the player on component unmount
			if (playerRef.current) {
				playerRef.current.dispose();
				playerRef.current = null;
			}
		};
	}, [options]);

	return (
		<div data-vjs-player>
			<video
				ref={videoRef}
				className="video-js vjs-theme-fantasy"
			></video>
		</div>
	);
};

export default VideoPlayer;
