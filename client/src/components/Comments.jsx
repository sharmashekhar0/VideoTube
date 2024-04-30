import React, { useEffect, useState } from "react";
import {
	addComment,
	getVideoComments,
	updateComment,
	deleteComment,
} from "../api/comment";
import { useForm } from "react-hook-form";
import timeAgo from "../utils/timeAgo";

function Comments({ videoId }) {
	const [videoComments, setVideoComments] = useState([]);
	const { register, handleSubmit } = useForm();
	const [commentAdded, setCommentAdded] = useState(false);

	const getVideosCommmentsHandler = async () => {
		const result = await getVideoComments(videoId);
		if (Array.isArray(result)) {
			setVideoComments(result);
		}
	};

	const addCommentHandler = async (data) => {
		const content = {
			content: data.content,
		};
		await addComment(content, videoId);
		setCommentAdded(true);
	};

	useEffect(() => {
		getVideosCommmentsHandler();
		setCommentAdded(false);
	}, [commentAdded]);

	return (
		<>
			<button className="peer w-full rounded-lg border p-4 text-left duration-200 hover:bg-white/5 focus:bg-white/5 sm:hidden">
				<h6 className="font-semibold">573 Comments...</h6>
			</button>
			<div className="fixed inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
				<form
					onSubmit={handleSubmit(addCommentHandler)}
					className="block"
				>
					<h6 className="mb-4 font-semibold">573 Comments</h6>
					<input
						type="text"
						className="w-full rounded-lg border bg-transparent px-2 py-1 placeholder-white"
						placeholder="Add a Comment"
						{...register("content", { required: true })}
					/>
				</form>
				<hr className="my-4 border-white" />
				{videoComments?.map((comment) => {
					return (
						<div key={comment._id}>
							<div className="flex gap-x-4">
								<div className="mt-2 h-11 w-11 shrink-0">
									<img
										src={comment?.user?.avatar}
										alt="sarahjv"
										className="h-full w-full rounded-full"
									/>
								</div>
								<div className="block">
									<p className="flex items-center text-gray-200 gap-4">
										{comment?.user?.fullName}
										<span className="text-sm">
											{timeAgo(comment?.createdAt)}
										</span>
									</p>
									<p className="text-sm text-gray-200">
										@{comment?.user?.username}
									</p>
									<p className="mt-3 text-sm">
										{comment?.content}
									</p>
								</div>
							</div>
							<hr className="my-4 border-white" />
						</div>
					);
				})}
			</div>
		</>
	);
}

export default Comments;
