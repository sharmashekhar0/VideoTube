import React from "react";
import { useForm } from "react-hook-form";
import { publishVideo } from "../api/video";
import useUploadVideo from "../hooks/useUploadVideo";

function UploadVideoModalPopup() {
	const { register, handleSubmit } = useForm();
	const { onClose } = useUploadVideo();

	const uploadVideoHandler = async (data) => {
		try {
			console.log("Data :: ", data);
			const formData = new FormData();

			for (const key in data) {
				if (data[key] instanceof FileList) {
					Array.from(data[key]).forEach((file) => {
						formData.append(key, file);
					});
				} else {
					formData.append(key, data[key]);
				}
			}
			const result = await publishVideo(formData);
			console.log("Upload video response :: ", result.data);
			onClose();
		} catch (error) {
			console.log("Error while uploading video", error);
		}
	};

	return (
		<div className="absolute inset-0 z-10 bg-black/50 px-4 pb-[86px] pt-4 sm:px-14 sm:py-8">
			<form
				onSubmit={handleSubmit(uploadVideoHandler)}
				className="h-full overflow-auto border bg-[#121212]"
			>
				<div className="flex items-center justify-between border-b p-4">
					<h2 className="text-xl font-semibold">Upload Videos</h2>
					<div className="flex items-center gap-4">
						<button
							type="submit"
							className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
						>
							Save
						</button>
						<button
							onClick={onClose}
							className="group/btn mr-1 flex w-auto items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
						>
							Close
						</button>
					</div>
				</div>
				<div className="mx-auto flex w-full max-w-3xl flex-col gap-y-4 p-4">
					<div className="w-full border-2 border-dashed px-4 py-12 text-center">
						<span className="mb-4 inline-block w-24 rounded-full bg-[#E4D3FF] p-4 text-[#AE7AFF]">
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
									d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
								></path>
							</svg>
						</span>
						<h6 className="mb-2 font-semibold">
							Drag and drop video files to upload
						</h6>
						<p className="text-gray-400">
							Your videos will be private untill you publish them.
						</p>
						<label
							htmlFor="upload-video"
							className="group/btn mt-4 inline-flex w-auto cursor-pointer items-center gap-x-2 bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
						>
							<input
								type="file"
								id="upload-video"
								className="sr-only"
								{...register("videoFile", { required: true })}
							/>
							Select Files
						</label>
					</div>
					<div className="w-full">
						<label
							htmlFor="thumbnail"
							className="mb-1 inline-block"
						>
							Thumbnail
							<sup>*</sup>
						</label>
						<input
							id="thumbnail"
							type="file"
							className="w-full border p-1 file:mr-4 file:border-none file:bg-[#ae7aff] file:px-3 file:py-1.5"
							{...register("thumbnail", { required: true })}
						/>
					</div>
					<div className="w-full">
						<label htmlFor="title" className="mb-1 inline-block">
							Title
							<sup>*</sup>
						</label>
						<input
							id="title"
							type="text"
							className="w-full border bg-transparent px-2 py-1 outline-none"
							{...register("title", { required: true })}
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
						></textarea>
					</div>
				</div>
			</form>
		</div>
	);
}

export default UploadVideoModalPopup;
