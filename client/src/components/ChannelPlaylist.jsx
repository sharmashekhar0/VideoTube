import React, { useEffect, useState } from "react";
import { getUserPlaylists } from "../api/playlist";
import { getUserChannelProfile } from "../api/user";
import timeAgo from "../utils/timeAgo";
import { Link } from "react-router-dom";
import ChannelEmptyPlaylist from "../components/ChannelEmptyPlaylist";
import playlistThumbnail from "../assets/playlistThumbnail.jpg";

function ChannelPlaylist() {
	const [channelPlaylists, setChannelPlaylists] = useState([]);
	const [loading, setLoading] = useState(true);

	const getUserPlaylistsHandler = async () => {
		try {
			const pathname = window.location.pathname;
			const pathParts = pathname.split("/");
			const username = pathParts[5];
			const result = await getUserChannelProfile(username);
			setChannelPlaylists(result?.playlists);
			console.log("Playlists :: ", result);
		} catch (error) {
			console.log("Error while getting channel playlist :: ", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getUserPlaylistsHandler();
	}, []);

	return (
		<>
			{loading ? (
				<ChannelEmptyPlaylist />
			) : (
				<div className="grid gap-4 pt-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
					{channelPlaylists?.map((playlist) => {
						console.log(playlist);
						return (
							<Link
								key={playlist?._id}
								to={`/api/v1/playlists/${playlist._id}`}
							>
								<div className="w-full">
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
																{
																	playlist
																		.videos
																		.length
																}{" "}
																videos
															</span>
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
							</Link>
						);
					})}
				</div>
			)}
		</>
	);
}

export default ChannelPlaylist;
