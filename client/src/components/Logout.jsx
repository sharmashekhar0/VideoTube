import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../api/user";
import { logout as authLogout } from "../store/authSlice";
import { toast } from "react-toastify";

function Logout() {
	const dispatch = useDispatch();
	const logoutHandler = async () => {
		try {
			const response = await logout();
			if (response) {
				dispatch(authLogout());
				toast.success("Logout Success");
			} else {
				toast.error("Something Went Wrong");
			}
		} catch (error) {
			toast.error("Something Went Wrong");
			console.log("Error while logging out :: ", error);
		}
	};

	return (
		<button
			onClick={logoutHandler}
			className="mr-1 w-full bg-[#ae7aff] px-3 py-2 text-center font-bold text-black shadow-[5px_5px_0px_0px_#4f4e4e] transition-all duration-150 ease-in-out active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0px_0px_0px_0px_#4f4e4e] sm:w-auto"
		>
			Logout
		</button>
	);
}

export default Logout;
