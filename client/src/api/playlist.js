const createUserPlaylist = async (data) => {
	try {
		console.log("Data ", data);
		const response = await fetch(
			"http://localhost:8000/api/v1/playlists/",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			}
		);
		const res = await response.json();
		console.log("Create Playlist Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while creating playlist :: ", error);
	}
};

const getUserPlaylists = async () => {
	try {
		const response = await fetch("http://localhost:8000/api/v1/playlists", {
			method: "GET",
			credentials: "include",
		});
		const res = await response.json();
		console.log("Get User Playlist Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while getting user playlists :: ", error);
	}
};

const getPlaylistById = async (playlistId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/playlists/${playlistId}`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		const res = await response.json();
		console.log("Get Playlist By Id Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while getting playlist by id :: ", error);
	}
};

const addVideoToPlaylist = async (videoId, playlistId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/playlists/add/${videoId}/${playlistId}`,
			{
				method: "PATCH",
				credentials: "include",
			}
		);
		const res = await response.json();
		console.log("Add Video To Playlist Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while adding video to playlist :: ", error);
	}
};

const removeVideoFromPlaylist = async (videoId, playlistId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/playlists/remove/${videoId}/${playlistId}`,
			{
				method: "PATCH",
				credentials: "include",
			}
		);
		const res = await response.json();
		console.log("Remove Video From Playlist Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while removing video from playlist :: ", error);
	}
};

const deletePlaylist = async (playlistId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/playlists/${playlistId}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);
		console.log("Delete Playlist Response :: ", await response.json());
	} catch (error) {
		console.log("Error while deleting playlist :: ", error);
	}
};

const updatePlaylist = async (data, playlistId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/playlists/${playlistId}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(data),
			}
		);
		console.log("Update Playlist Response :: ", await response.json());
	} catch (error) {
		console.log("Error while updating playlist :: ", error);
	}
};

export {
	createUserPlaylist,
	getUserPlaylists,
	getPlaylistById,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylist,
	updatePlaylist,
};
