import React from "react";
import { useForm } from "react-hook-form";
import { changeCurrentPassword } from "../api/user";

function ChangePassword() {
	const { register, handleSubmit } = useForm();

	const changePasswordHandler = async (data) => {
		try {
			const result = await changeCurrentPassword(data);
			console.log("Result :: ", result);
		} catch (error) {
			console.log("Error while changing password :: ", error);
		}
	};

	return (
		<div className="flex flex-wrap justify-center gap-y-4 py-4">
			<div className="w-full sm:w-1/2 lg:w-1/3">
				<h5 className="font-semibold">Password</h5>
				<p className="text-gray-300">
					Please enter your current password to change your password.
				</p>
			</div>
			<div className="w-full sm:w-1/2 lg:w-2/3">
				<form
					onSubmit={handleSubmit(changePasswordHandler)}
					className="rounded-lg border"
				>
					<div className="flex flex-wrap gap-y-4 p-4">
						<div className="w-full">
							<label
								className="mb-1 inline-block"
								htmlFor="old-pwd"
							>
								Current password
							</label>
							<input
								type="password"
								className="w-full rounded-lg border bg-transparent px-2 py-1.5"
								id="old-pwd"
								placeholder="Current password"
								{...register("oldPassword", { required: true })}
							/>
						</div>
						<div className="w-full">
							<label
								className="mb-1 inline-block"
								htmlFor="new-pwd"
							>
								New password
							</label>
							<input
								type="password"
								className="w-full rounded-lg border bg-transparent px-2 py-1.5"
								id="new-pwd"
								placeholder="New password"
								{...register("newPassword", { required: true })}
							/>
							<p className="mt-0.5 text-sm text-gray-300">
								Your new password must be more than 8
								characters.
							</p>
						</div>
						<div className="w-full">
							<label
								className="mb-1 inline-block"
								htmlFor="cnfrm-pwd"
							>
								Confirm password
							</label>
							<input
								type="password"
								className="w-full rounded-lg border bg-transparent px-2 py-1.5"
								id="cnfrm-pwd"
								placeholder="Confirm password"
								{...register("confirmPassword", {
									required: true,
								})}
							/>
						</div>
					</div>
					<hr className="border border-gray-300" />
					<div className="flex items-center justify-end gap-4 p-4">
						<button className="inline-block rounded-lg border px-3 py-1.5 hover:bg-white/10">
							Cancel
						</button>
						<button className="inline-block bg-[#ae7aff] px-3 py-1.5 text-black">
							Update Password
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ChangePassword;
