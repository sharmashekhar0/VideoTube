import React, { useEffect, useState } from "react";
import { getUserPlaylists } from "../api/playlist";
import { getUserChannelProfile } from "../api/user";
import timeAgo from "../utils/timeAgo";

function ChannelPlaylist() {
	const [channelPlaylists, SetChannelPlaylists] = useState([]);

	const getUserPlaylistsHandler = async () => {
		const pathname = window.location.pathname;
		const pathParts = pathname.split("/");
		const username = pathParts[5];
		const result = await getUserChannelProfile(username);
		SetChannelPlaylists(result?.playlists);
		console.log("Playlists :: ", result);
	};

	useEffect(() => {
		getUserPlaylistsHandler();
	}, []);

	return (
		<>
			<div className="grid gap-4 pt-2 sm:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
				{channelPlaylists?.map((playlist) => {
					return (
						<div key={playlist?._id} className="w-full">
							<div className="relative mb-2 w-full pt-[56%]">
								<div className="absolute inset-0">
									<img
										src="https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
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
														12 videos
													</span>
												</p>
												<p className="text-sm text-gray-200">
													100K Views · 
													{/* {timeAgo(
														playlist?.createdAt
													)} */}
													{playlist?.createdAt}
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
							<h6 className="mb-1 font-semibold">
								{playlist?.name}
							</h6>
							<p className="flex text-sm text-gray-200">
								{playlist?.description}
							</p>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default ChannelPlaylist;
