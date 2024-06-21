import React from "react";
import {
	updateAccountDetails,
	updateAvatar,
	updateCoverImage,
} from "../../api/user";
import { useForm } from "react-hook-form";

function EditPersonalInformation({ avatar, coverImage }) {
	const { register, handleSubmit } = useForm();

	const updatePersonalInformationHandler = async (formData) => {
		try {
			console.log(formData);
			if (formData?.fullName || formData?.username || formData?.email) {
				const response = await updateAccountDetails(formData);
				console.log(response);
			}

			if (avatar) {
				const data = {
					avatar: avatar,
				};
				const response = await updateAvatar(data);
				console.log(response);
			}

			if (coverImage) {
				const data = {
					coverImage: coverImage,
				};
				const response = await updateCoverImage(data);
				console.log(response);
			}
		} catch (error) {
			console.log("Error while updating account details :: ", error);
		}
	};

	return (
		<div className="flex flex-wrap justify-center gap-y-4 py-4">
			<div className="w-full sm:w-1/2 lg:w-1/3">
				<h5 className="font-semibold">Personal Info</h5>
				<p className="text-gray-300">
					Update your photo and personal details.
				</p>
			</div>
			<form
				onSubmit={handleSubmit(updatePersonalInformationHandler)}
				className="w-full sm:w-1/2 lg:w-2/3"
			>
				<div className="rounded-lg border">
					<div className="flex flex-wrap gap-y-4 p-4">
						<div className="w-full lg:w-1/2 lg:pr-2">
							<label
								htmlFor="fullName"
								className="mb-1 inline-block"
							>
								Full name
							</label>
							<input
								type="text"
								className="w-full rounded-lg border bg-transparent px-2 py-1.5"
								id="fullName"
								placeholder="Enter full name"
								{...register("fullName")}
							/>
						</div>
						<div className="w-full lg:w-1/2 lg:pl-2">
							<label
								htmlFor="username"
								className="mb-1 inline-block"
							>
								Username
							</label>
							<input
								type="text"
								className="w-full rounded-lg border bg-transparent px-2 py-1.5"
								id="username"
								placeholder="Enter username"
								{...register("username")}
							/>
						</div>
						<div className="w-full">
							<label
								htmlFor="email"
								className="mb-1 inline-block"
							>
								Email address
							</label>
							<div className="relative">
								<div className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300">
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
											d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
										></path>
									</svg>
								</div>
								<input
									type="email"
									className="w-full rounded-lg border bg-transparent py-1.5 pl-10 pr-2"
									id="email"
									placeholder="Enter email address"
									{...register("email")}
								/>
							</div>
						</div>
					</div>
					<hr className="border border-gray-300" />
					<div className="flex items-center justify-end gap-4 p-4">
						<button className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">
							Cancel
						</button>
						<button
							type="submit"
							className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black"
						>
							Save changes
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

export default EditPersonalInformation;
