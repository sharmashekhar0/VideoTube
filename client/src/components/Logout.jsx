import React from "react";

function Logout() {
	const logoutHandler = async () => {
		try {
			const response = await fetch(
				"http://localhost:8000/api/v1/users/logout",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			);
			console.log("Logout Response :: ", await response.json());
		} catch (error) {
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
