const registerUser = async (data) => {
	try {
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
		const registeredUser = await fetch(
			"http://localhost:8000/api/v1/users/register",
			{
				method: "POST",
				body: formData,
			}
		);

		if (!registeredUser) {
			throw new error("Registration failed :: ", registerUser);
		}

		console.log("Registered user :: ", await registeredUser.json());
	} catch (error) {
		console.log("Error while registering user :: ", error);
	}
};

const login = async (data) => {
	try {
		let logginInUser = await fetch(
			"http://localhost:8000/api/v1/users/login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			}
		);

		if (!logginInUser) {
			throw new error("Login failed");
		}

		logginInUser = await logginInUser.json();
		console.log("User logged in :: ", logginInUser);
		return logginInUser.data.user;
	} catch (error) {
		console.log("Error while logging the user :: ", error);
	}
};

const logout = async () => {
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
		console.log("User Logged out :: ", await response.json());
		return response;
	} catch (error) {
		console.log("Error while logging out :: ", error);
	}
};

const refreshAccessToken = async () => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/users/refresh-token/",
			{
				method: "POST",
				credentials: "include",
			}
		);
		console.log("Refresh Access Token Response :: ", await response.json());
	} catch (error) {
		console.log("Error while refreshing access token :: ", error);
	}
};

const changeCurrentPassword = async (data) => {
	if (data.newPassword !== data.confirmPassword) {
		console.log("Password did not match", data);
	} else {
		try {
			const response = await fetch(
				"http://localhost:8000/api/v1/users/change-password/",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(data),
				}
			);
			const result = await response.json();
			console.log("Password Changed :: ", result);
			return result.success;
		} catch (error) {
			console.log("Error while changing password :: ", error);
		}
	}
};

const getCurrentUser = async () => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/users/current-user/",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Current User :: ", result);
		return result;
	} catch (error) {
		console.log("Error while getting current user :: ", error);
	}
};

const updateAccountDetails = async (data) => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/users/update-account/",
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			}
		);
		console.log(
			"Update Account Details Response :: ",
			await response.json()
		);
	} catch (error) {
		console.log("Error while updating account details :: ", error);
	}
};

const updateAvatar = async (data) => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/users/avatar/",
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			}
		);
		console.log("Update Avatar Response :: ", await response.json());
	} catch (error) {
		console.log("Error while updating avatar :: ", error);
	}
};

const updateCoverImage = async (data) => {
	try {
		const response = fetch(
			"http://localhost:8000/api/v1/users/cover-image/",
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			}
		);
		console.log("Update Cover Image Response :: ", (await response).json());
	} catch (error) {
		console.log("Error while updating cover image :: ", error);
	}
};

const getWatchHistory = async () => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/users/history/",
			{
				method: "GET",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Watch History Response :: ", result);
		return result;
	} catch (error) {
		console.log("Error while getting watch history :: ", error);
	}
};

const getUserChannelProfile = async (username) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/users/c/${username}/`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("User Channel Profile Response :: ", result.data);
		return result.data;
	} catch (error) {
		console.log("Error while getting user channel profile :: ", error);
	}
};

export {
	registerUser,
	login,
	logout,
	refreshAccessToken,
	changeCurrentPassword,
	getCurrentUser,
	updateAccountDetails,
	updateAvatar,
	updateCoverImage,
	getWatchHistory,
	getUserChannelProfile,
};
