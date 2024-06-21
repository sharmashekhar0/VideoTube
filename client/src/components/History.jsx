import React, { useEffect } from "react";

function History() {
	return (
		<section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4">
				{/* {allVideos.map((video) => {
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
											className="h-full w-full"
										/>
									</div>
									<span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
										{convertTimeToHHMMSS(video.duration)}
									</span>
								</div>
								<div className="flex gap-x-2">
									<div className="h-10 w-10 shrink-0">
										<img
											src="https://images.pexels.com/photos/3532545/pexels-photo-3532545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
											alt="codemaster"
											className="h-full w-full rounded-full"
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
											Code Master
										</p>
									</div>
								</div>
							</div>
						</Link>
					);
				})} */}
			</div>
		</section>
	);
}

export default History;
