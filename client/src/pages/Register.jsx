import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/user";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function Register() {
	const { register, handleSubmit, setValue } = useForm();
	const navigate = useNavigate();
	const [avatar, setAvatar] = useState(null);

	const registerHandler = async (data) => {
		try {
			console.log(data);
			const response = await registerUser(data);
			if (response) {
				toast.success("Register Success");
				navigate("/api/v1/users/login");
			} else {
				toast.error("Register Failed");
			}
		} catch (error) {
			toast?.error("Register Failed");
			console.log("Error while registering user :: ", error);
		}
	};

	const handleAvatarChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setAvatar(file);
			setValue("avatar", file);
		}
	};

	return (
		<div className="mx-auto flex w-full items-stretch justify-between gap-10">
			<div className="fixed left-0 top-0 hidden h-screen w-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 md:block md:w-1/3"></div>
			<div className="bg-[#121212] ml-auto mt-4 flex w-full flex-col items-start justify-start p-6 sm:max-w-4xl md:w-2/3 lg:px-10">
				<div className="w-full text-center">
					<h1 className="mb-3 text-5xl font-extrabold text-white">
						Register
					</h1>
					<p className="text-xs text-slate-400">
						Please create your account
					</p>
				</div>
				<form
					onSubmit={handleSubmit(registerHandler)}
					className="my-14 flex w-full flex-col items-start justify-start gap-4"
				>
					<div className="flex w-full items-center justify-center">
						<input
							id="avatar-input-1"
							hidden
							type="file"
							onChange={handleAvatarChange}
						/>
						<label
							htmlFor="avatar-input-1"
							className="relative flex aspect-square h-24 w-24 cursor-pointer items-center justify-center overflow-visible rounded-full border-4 border-[#ae7aff] p-1"
						>
							{avatar ? (
								<img
									src={URL.createObjectURL(avatar)}
									alt="Avatar Preview"
									className="h-full w-full rounded-full object-cover"
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										aria-hidden="true"
										className="h-8 w-8 text-white"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 4.5v15m7.5-7.5h-15"
										></path>
									</svg>
								</div>
							)}
							<span className="absolute bottom-0 right-0 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-[#ae7aff] p-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
									stroke="currentColor"
									aria-hidden="true"
									className="h-3 w-3 text-black"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 4.5v15m7.5-7.5h-15"
									></path>
								</svg>
							</span>
						</label>
					</div>
					<div className="mt-10 flex w-full flex-col items-center justify-between gap-4 md:flex-row">
						<div className="flex w-full flex-col items-start justify-start gap-2">
							<label className="text-xs text-slate-200">
								Full Name
							</label>
							<input
								placeholder="Enter a full name..."
								autoComplete="false"
								className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
								{...register("fullName", { required: true })}
							/>
						</div>
						<div className="flex w-full flex-col items-start justify-start gap-2">
							<label className="text-xs text-slate-200">
								Username
							</label>
							<input
								placeholder="Enter a  username..."
								autoComplete="false"
								className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
								{...register("username", { required: true })}
							/>
						</div>
					</div>
					<div className="flex w-full flex-col items-start justify-start gap-2">
						<label className="text-xs text-slate-200">Email</label>
						<input
							placeholder="Enter an email..."
							autoComplete="false"
							className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
							{...register("email", { required: true })}
						/>
					</div>
					<div className="flex w-full flex-col items-start justify-start gap-2">
						<label className="text-xs text-slate-200">
							Password
						</label>
						<input
							placeholder="Enter a password..."
							autoComplete="false"
							type="password"
							className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
							{...register("password", { required: true })}
						/>
					</div>
					<div className="flex w-full flex-col items-start justify-start gap-2">
						<label className="text-xs text-slate-200">
							{"Cover Image (optional)"}
						</label>
						<input
							placeholder=""
							autoComplete="false"
							type="file"
							className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
							{...register("coverImage")}
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
					>
						Create Account
					</button>
				</form>
			</div>
		</div>
	);
}

export default Register;
