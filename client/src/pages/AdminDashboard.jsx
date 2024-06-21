import React, { useEffect, useState } from "react";
import { getUserChannelProfile } from "../api/user";
import { useSelector } from "react-redux";
import {
	getTotalViewsCount,
	getVideoLikeCount,
	togglePublishStatus,
} from "../api/video";
import DeleteVideoModalPopup from "../components/DeleteVideoModalPopup";
import EditVideoModalPopup from "../components/EditVideoModalPopup";
import UploadVideoModalPopup from "../components/UploadVideoModalPopup";
import { getLikedVideos } from "../api/like";
import { Link } from "react-router-dom";
import useUploadVideo from "../hooks/useUploadVideo";

function AdminDashboard() {
	const { isOpen, onOpen, onClose } = useUploadVideo();
	const [userChannelVideos, setUserChannelVideos] = useState([]);
	const userData = useSelector((state) => state.auth.userData);
	const [userChannel, setUserChannel] = useState({});
	const [totalViewsCount, setTotalViewsCount] = useState(0);

	const [isDeleteVideoModalOpen, setIsDeleteVideoModalOpen] = useState(false);
	const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState(false);
	const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
	const [video, setVideo] = useState("");
	const [likedVideoCount, setLikedVideoCount] = useState(0);
	const [videoLikeCount, setVideoLikeCount] = useState({});

	const getVideoLikeCountHandler = async () => {
		try {
			const response = await getVideoLikeCount();
			console.log(response?.data);
			let videoLikes = {};
			response?.data?.map(({ _id, likeCount }) => {
				videoLikes[_id] = likeCount;
			});
			console.log(videoLikes);
			setVideoLikeCount(videoLikes);
		} catch (error) {
			console.log("Error while getting videos like count :: ", error);
		}
	};

	const getUserChannelDetailsHandler = async () => {
		try {
			const username = userData?.username;
			const response = await getUserChannelProfile(username);
			console.log("Admin Dashboard :: ", response);
			setUserChannelVideos(response?.videos);
			console.log(response?.videos);
			setUserChannel(response);
		} catch (error) {
			console.log("Error while getting user profile :: ", error);
		}
	};

	const getLikedVideoCountHandler = async () => {
		try {
			const response = await getLikedVideos();
			console.log(response?.data);
			setLikedVideoCount(response?.data?.likedVideos?.length);
		} catch (error) {
			console.log("Error while getting liked video count :: ", error);
		}
	};

	const getTotalViewsCountHandler = async () => {
		try {
			const response = await getTotalViewsCount();
			console.log(response);
			setTotalViewsCount(response?.data);
		} catch (error) {
			console.log("Error while getting total views :: ", error);
		}
	};

	const togglePublishStatusHandler = async (videoId) => {
		try {
			const response = await togglePublishStatus(videoId);
			console.log("Response Toggle Publish Status :: ", response);
			const updatedVideo = response?.data?.videoDetails;

			if (!updatedVideo) {
				throw new Error("Video details not found in response");
			}

			const updatedVideos = userChannelVideos?.map((video) =>
				video._id === videoId
					? {
							...video,
							isPublished: updatedVideo?.isPublished,
					  }
					: video
			);
			setUserChannelVideos(updatedVideos);
		} catch (error) {
			console.log("Error while toggling publish status :: ", error);
		}
	};

	function formatDate(dateString) {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
		const year = date.getFullYear();

		return `${day}-${month}-${year}`;
	}

	useEffect(() => {
		getUserChannelDetailsHandler();
		getLikedVideoCountHandler();
		getTotalViewsCountHandler();
		getVideoLikeCountHandler();
	}, [userData]);

	const uploadVideoHandler = () => {
		onOpen();
	};

	const openModal = (modalName, video) => {
		if (modalName === "delete") setIsDeleteVideoModalOpen(true);
		else if (modalName === "edit") setIsEditVideoModalOpen(true);
		else if (modalName === "upload") setIsUploadVideoModalOpen(true);
		setVideo(video);
	};

	const closeModal = (modalName) => {
		if (modalName === "delete") setIsDeleteVideoModalOpen(false);
		else if (modalName === "edit") setIsEditVideoModalOpen(false);
		else if (modalName === "upload") setIsUploadVideoModalOpen(false);
	};

	return (
		<>
			<div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-y-6 px-4 py-8">
					<div className="flex flex-wrap justify-between gap-4">
						<div className="block">
							<h1 className="text-2xl font-bold">
								Welcome Back, {userData?.fullName}
							</h1>
							<p className="text-sm text-gray-300">
								Seamless Video Management, Elevated Results.
							</p>
						</div>
						<div className="block">
							<Link
								onClick={uploadVideoHandler}
								to={`/api/v1/users/my-channel/${userData?.username}`}
							>
								<button className="inline-flex items-center gap-x-2 bg-[#ae7aff] px-3 py-2 font-semibold text-black">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="2"
										stroke="currentColor"
										aria-hidden="true"
										className="h-5 w-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 4.5v15m7.5-7.5h-15"
										></path>
									</svg>
									Upload video
								</button>
							</Link>
						</div>
					</div>
					<div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4">
						<div className="border p-4">
							<div className="mb-4 block">
								<span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
										></path>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
								</span>
							</div>
							<h6 className="text-gray-300">Total views</h6>
							<p className="text-3xl font-semibold">
								{totalViewsCount || 0}
							</p>
						</div>
						<div className="border p-4">
							<div className="mb-4 block">
								<span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
										></path>
									</svg>
								</span>
							</div>
							<h6 className="text-gray-300">Total subscribers</h6>
							<p className="text-3xl font-semibold">
								{userChannel?.subscriberCount}
							</p>
						</div>
						<div className="border p-4">
							<div className="mb-4 block">
								<span className="inline-block h-7 w-7 rounded-full bg-[#E4D3FF] p-1 text-[#ae7aff]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
										></path>
									</svg>
								</span>
							</div>
							<h6 className="text-gray-300">Total likes</h6>
							<p className="text-3xl font-semibold">
								{likedVideoCount}
							</p>
						</div>
					</div>
					<div className="w-full overflow-auto">
						<table className="w-full min-w-[1200px] border-collapse border text-white">
							<thead>
								<tr>
									<th className="border-collapse border-b p-4">
										Status
									</th>
									<th className="border-collapse border-b p-4">
										Status
									</th>
									<th className="border-collapse border-b p-4">
										Uploaded
									</th>
									<th className="border-collapse border-b p-4">
										Rating
									</th>
									<th className="border-collapse border-b p-4">
										Date uploaded
									</th>
									<th className="border-collapse border-b p-4"></th>
								</tr>
							</thead>
							<tbody>
								{userChannelVideos?.map((video) => {
									console.log(videoLikeCount);
									return (
										<tr
											key={video?._id}
											className="group border"
										>
											<td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
												<div className="flex justify-center">
													<label
														htmlFor={video?._id}
														className="relative inline-block w-12 cursor-pointer overflow-hidden"
													>
														<input
															type="checkbox"
															id={video?._id}
															className="peer sr-only"
															checked={
																video?.isPublished
															}
															onClick={() =>
																togglePublishStatusHandler(
																	video?._id
																)
															}
														/>
														<span className="inline-block h-6 w-full rounded-2xl bg-gray-200 duration-200 after:absolute after:bottom-1 after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-black after:duration-200 peer-checked:bg-[#ae7aff] peer-checked:after:left-7"></span>
													</label>
												</div>
											</td>
											{video?.isPublished ? (
												<td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
													<div className="flex justify-center">
														<span className="inline-block rounded-2xl border px-1.5 py-0.5 border-green-600 text-green-600">
															Published
														</span>
													</div>
												</td>
											) : (
												<td class="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
													<div class="flex justify-center">
														<span class="inline-block rounded-2xl border px-1.5 py-0.5 border-orange-600 text-orange-600">
															Unpublished
														</span>
													</div>
												</td>
											)}
											<td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
												<div className="flex items-center gap-4">
													<img
														className="h-10 w-10 rounded-full object-cover"
														src={userData?.avatar}
														alt="Code Master"
													/>
													<h3 className="font-semibold">
														{video?.title}
													</h3>
												</div>
											</td>
											<td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
												<div className="flex justify-center gap-4">
													<span className="inline-block rounded-xl bg-green-200 px-1.5 py-0.5 text-green-700">
														{videoLikeCount[
															video?._id
														] || 0}{" "}
														likes
													</span>
												</div>
											</td>
											<td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
												{formatDate(video?.createdAt)}
											</td>
											<td className="border-collapse border-b border-gray-600 px-4 py-3 group-last:border-none">
												<div className="flex gap-4">
													<button
														onClick={() =>
															openModal(
																"delete",
																video
															)
														}
														className="h-5 w-5 hover:text-[#ae7aff]"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="currentColor"
															aria-hidden="true"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															></path>
														</svg>
													</button>
													<button
														onClick={() =>
															openModal(
																"edit",
																video
															)
														}
														className="h-5 w-5 hover:text-[#ae7aff]"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="currentColor"
															aria-hidden="true"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
															></path>
														</svg>
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
				{isDeleteVideoModalOpen && (
					<DeleteVideoModalPopup onClose={closeModal} video={video} />
				)}
				{isEditVideoModalOpen && (
					<EditVideoModalPopup onClose={closeModal} video={video} />
				)}
			</div>
		</>
	);
}

export default AdminDashboard;
