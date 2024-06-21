import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createTweet, getUserTweets } from "../../api/tweet";
import { getUserChannelProfile } from "../../api/user";
import { getAllTweetLike, toggleTweetLike } from "../../api/like";
import { useSelector } from "react-redux";

import timeAgo from "../../utils/timeAgo";

function MyChannelTweets() {
	const user = useSelector((state) => state.auth.userData);
	const { register, handleSubmit } = useForm();
	const [channelTweets, setChannelTweets] = useState([]);
	const [channel, setChannel] = useState({});
	const [allTweetLikeCount, setAllTweetLikeCount] = useState({});
	const [tweetLikedByUser, setTweetLikedByUser] = useState({});

	const getChannelTweetsHandler = async () => {
		const pathname = window.location.pathname;
		const pathParts = pathname.split("/");
		const username = pathParts[5];
		const result = await getUserChannelProfile(username);
		setChannel(result);
		setChannelTweets(result.tweets);
	};

	function countTweetLikes(data) {
		const result = {};

		data.forEach((item) => {
			if (item.tweet) {
				if (result[item.tweet]) {
					result[item.tweet] += 1;
				} else {
					result[item.tweet] = 1;
				}
			}
		});

		return result;
	}

	function getUserLikedTweets(data, userId) {
		const result = {};

		data.forEach((item) => {
			if (item.likedBy === userId && item.tweet) {
				result[item.tweet] = true;
			}
		});

		return result;
	}

	const toggleTweetLikeHandler = async (tweetId) => {
		try {
			console.log(tweetId);
			const response = await toggleTweetLike(tweetId);
			if (response?.message === "Tweet like added successfully") {
				setAllTweetLikeCount((prevState) => ({
					...prevState,
					[tweetId]: (prevState[tweetId] || 0) + 1,
				}));
				setTweetLikedByUser((prevState) => ({
					...prevState,
					[tweetId]: true,
				}));
			} else if (
				response?.message === "Tweet like removed successfully"
			) {
				setAllTweetLikeCount((prevState) => ({
					...prevState,
					[tweetId]: (prevState[tweetId] || 0) - 1,
				}));
				const updatedTweetLikedByUser = { ...tweetLikedByUser };
				delete updatedTweetLikedByUser[tweetId];
				setTweetLikedByUser(updatedTweetLikedByUser);
			}
		} catch (error) {
			console.log("Error while toggling tweet like :: ", error);
		}
	};

	const getAllTweetLikeHandler = async () => {
		try {
			const response = await getAllTweetLike();
			const tweets = countTweetLikes(response?.data);
			const userLikedTweet = getUserLikedTweets(response?.data, user._id);
			console.log(response.data);
			console.log(tweets);
			setAllTweetLikeCount(tweets);
			setTweetLikedByUser(userLikedTweet);
		} catch (error) {
			console.log("Error while getting all tweet like :: ", error);
		}
	};

	useEffect(() => {
		getChannelTweetsHandler();
		getAllTweetLikeHandler();
	}, []);

	const createTweetHandler = async (data) => {
		try {
			const response = await createTweet(data);
			console.log("Tweet Created :: ", response);
			const newTweets = [...channelTweets, response];
			setChannelTweets(newTweets);
		} catch (error) {
			console.log("Error while creating tweet :: ", error);
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(createTweetHandler)}
				className="mt-2 border pb-2"
			>
				<textarea
					className="mb-2 h-10 w-full resize-none border-none bg-transparent px-3 pt-2 outline-none"
					placeholder="Write a tweet"
					{...register("content", { required: true })}
				></textarea>
				<div className="flex items-center justify-end gap-x-3 px-3">
					{/* <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
							></path>
						</svg>
					</button> */}
					{/* <button className="inline-block h-5 w-5 hover:text-[#ae7aff]">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="2"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
							></path>
						</svg>
					</button> */}
					<button className="bg-[#ae7aff] px-3 py-2 font-semibold text-black">
						Send
					</button>
				</div>
			</form>
			<div className="py-4">
				{channelTweets?.map((tweet) => {
					return (
						<div className="flex gap-3 border-b border-gray-700 py-4 last:border-b-transparent">
							<div className="h-14 w-14 shrink-0">
								<img
									src={channel?.avatar}
									alt="React Patterns"
									className="h-full w-full rounded-full object-cover"
								/>
							</div>
							<div className="w-full">
								<h4 className="mb-1 flex items-center gap-x-2">
									<span className="font-semibold">
										{channel?.fullName}
									</span>
									 
									<span className="inline-block text-sm text-gray-400">
										{timeAgo(tweet?.createdAt)}
									</span>
								</h4>
								<p className="mb-2">{tweet?.content}</p>
								<div className="flex">
									<button
										className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-like-count)] focus:after:content-[attr(data-like-count-alt)]"
										onClick={() =>
											toggleTweetLikeHandler(tweet._id)
										}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											aria-hidden="true"
											className={`h-5 w-5 ${
												tweetLikedByUser[tweet._id]
													? "text-[#ae7aff]"
													: ""
											}`}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
											></path>
										</svg>
									</button>
									<span>
										{allTweetLikeCount[tweet._id] || 0}
									</span>
									{/* <button
										className="group inline-flex items-center gap-x-1 outline-none after:content-[attr(data-dislike-count)] focus:after:content-[attr(data-dislike-count-alt)]"
										data-dislike-count="87"
										data-dislike-count-alt="86"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											aria-hidden="true"
											className="h-5 w-5 text-[#ae7aff] group-focus:text-inherit"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
											></path>
										</svg>
									</button> */}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default MyChannelTweets;
