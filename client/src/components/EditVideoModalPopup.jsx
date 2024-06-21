import React, { useState, useEffect } from "react";
import { updateVideo } from "../api/video";
import { useForm } from "react-hook-form";

function EditVideoModalPopup({ onClose, video }) {
	console.log("Video :: ", video);
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		setValue("title", video?.title || "");
		setValue("description", video?.description || "");
	}, [setValue]);

	const updateVideoHandler = async (data) => {
		try {
			const formData = new FormData();
			formData.append("thumbnail", data?.thumbnail[0]);
			formData.append("title", data?.title);
			formData.append("description", data?.description);
			const response = await updateVideo(formData, video?._id);
			console.log(response);
		} catch (error) {
			console.log("Error while editing video :: ", error);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(updateVideoHandler)}
			className="fixed inset-0 top-[calc(66px)] z-10 flex flex-col bg-black/50 px-4 pb-[86px] pt-4 sm:top-[calc(82px)] sm:px-14 sm:py-8"
		>
			<div className="mx-auto w-full max-w-lg overflow-auto rounded-lg border border-gray-700 bg-[#121212] p-4">
				<div className="mb-4 flex items-start justify-between">
					<h2 className="text-xl font-semibold">
						Edit Video
						<span className="block text-sm text-gray-300">
							Share where you&#x27;ve worked on your profile.
						</span>
					</h2>
					<button onClick={() => onClose("edit")} className="h-6 w-6">
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
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
				<label htmlFor="thumbnail" className="mb-1 inline-block">
					Thumbnail
					<sup>*</sup>
				</label>
				<label
					className="relative mb-4 block cursor-pointer border border-dashed p-2 after:absolute after:inset-0 after:bg-transparent hover:after:bg-black/10"
					htmlFor="thumbnail"
				>
					<input
						type="file"
						className="sr-only"
						id="thumbnail"
						{...register("thumbnail")}
					/>
					<img
						src={video?.thumbnail}
						alt="State Management with Redux"
					/>
				</label>
				<div className="mb-6 flex flex-col gap-y-4">
					<div className="w-full">
						<label htmlFor="title" className="mb-1 inline-block">
							Title
							<sup>*</sup>
						</label>
						<input
							id="title"
							type="text"
							className="w-full border bg-transparent px-2 py-1 outline-none"
							{...register("title")}
						/>
					</div>
					<div className="w-full">
						<label htmlFor="desc" className="mb-1 inline-block">
							Description
							<sup>*</sup>
						</label>
						<textarea
							id="desc"
							className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none"
							{...register("description")}
						>
							{video?.description}
						</textarea>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<button
						onClick={() => onClose("edit")}
						className="border px-4 py-3"
					>
						Cancel
					</button>
					<button className="bg-[#ae7aff] px-4 py-3 text-black disabled:bg-[#E4D3FF]">
						Update
					</button>
				</div>
			</div>
		</form>
	);
}

export default EditVideoModalPopup;
