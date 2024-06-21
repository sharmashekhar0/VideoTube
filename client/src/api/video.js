const getAllVideos = async () => {
	try {
		const response = await fetch("http://localhost:8000/api/v1/videos/", {
			method: "GET",
			credentials: "include",
		});
		const result = await response.json();
		console.log("All Videos Response :: ", result);
		return result.data.videoDetails;
	} catch (error) {
		console.log("Error while getting all videos :: ", error);
	}
};

const publishVideo = async (data) => {
	try {
		const response = await fetch("http://localhost:8000/api/v1/videos/", {
			method: "POST",
			credentials: "include",
			body: data,
		});
		const result = await response.json();
		return result;
	} catch (error) {
		console.log("Error while publishing video :: ", error);
	}
};

const getVideoById = async (videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/videos/${videoId}`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Get Video By Id Response :: ", result);
		return result.data.videoDetails;
	} catch (error) {
		console.log("Error while getting video :: ", error);
	}
};

const updateViewsCount = async (videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/videos/views/${videoId}`,
			{
				method: "PATCH",
				credentials: "include",
			}
		);
		const res = await response.json();
		return res;
	} catch (error) {
		console.log("Error while updating videos count :: ", error);
	}
};

const updateVideo = async (data, videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/videos/${videoId}`,
			{
				method: "PATCH",
				credentials: "include",
				body: data,
			}
		);
		const res = await response.json();
		console.log("Update Video Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while updating video :: ", error);
	}
};

const deleteVideo = async (videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/videos/${videoId}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);
		console.log("Delete Video Response :: ", await response.json());
	} catch (error) {
		console.log("Error while deleting video :: ", error);
	}
};

const togglePublishStatus = async (videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/videos/toggle/publish/${videoId}`,
			{ method: "PATCH", credentials: "include" }
		);
		const result = await response.json();
		console.log("Toggle Publish Status Response :: ", result);
		return result;
	} catch (error) {
		console.log("Error while toggling publish status :: ", error);
	}
};

const getTotalViewsCount = async () => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/videos/views`,
			{ method: "GET", credentials: "include" }
		);
		const res = await response.json();
		return res;
	} catch (error) {
		console.log("Error while getting total views :: ", error);
	}
};

const getVideoLikeCount = async () => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/videos/likes",
			{
				method: "GET",
				credentials: "include",
			}
		);
		const res = await response.json();
		console.log(res);
		return res;
	} catch (error) {
		console.log("Error while getting videos like count :: ", error);
	}
};

export {
	getAllVideos,
	publishVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	updateViewsCount,
	togglePublishStatus,
	getVideoLikeCount,
	getTotalViewsCount,
};
