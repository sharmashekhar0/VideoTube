import React from "react";
import { useForm } from "react-hook-form";
import { login } from "../api/user";

function Login() {
	const { register, handleSubmit } = useForm();

	const loginHandler = async (data) => {
		await login(data);
	};

	return (
		<div className="mx-auto flex w-full items-stretch justify-between gap-10">
			<div className="fixed left-0 top-0 hidden h-screen w-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 md:block md:w-1/3"></div>
			<div className="bg-[#121212] ml-auto mt-4 flex w-full flex-col items-start justify-start p-6 sm:max-w-4xl md:w-2/3 lg:px-10">
				<div className="w-full">
					<h1 className="mb-3 text-5xl font-extrabold text-white">
						Login
					</h1>
					<p className="text-xs text-slate-400">
						Login to access your account
					</p>
				</div>
				<form
					onSubmit={handleSubmit(loginHandler)}
					className="my-14 flex w-full flex-col items-start justify-start gap-4"
				>
					<div className="flex w-full flex-col items-start justify-start gap-2">
						<label className="text-xs text-slate-200">
							Username
						</label>
						<input
							placeholder="Enter a username..."
							autoComplete="false"
							className="w-full border-[1px] border-white bg-black p-4 text-white placeholder:text-gray-500"
							{...register("username", { required: true })}
						/>
					</div>
					<div className="flex w-full flex-col items-start justify-start gap-2">
						<label className="text-xs text-slate-200">Email</label>
						<input
							placeholder="Enter a email..."
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
					<button
						type="submit"
						className="w-full bg-[#ae7aff] p-3 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e]"
					>
						Log in
					</button>
				</form>
			</div>
		</div>
	);
}

export default Login;
