const toggleVideoLike = async (videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/likes/toggle/v/${videoId}`,
			{
				method: "POST",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Toggle Video Like Response :: ", result);
		return result;
	} catch (error) {
		console.log("Error while toggling video like :: ", error);
	}
};

const toggleCommentLike = async (commentId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/likes/toggle/c/${commentId}`,
			{
				method: "POST",
				credentials: "include",
			}
		);
		console.log("Toggle Comment Like Response :: ", await response.json());
	} catch (error) {
		console.log("Error while toggling comment like :: ", error);
	}
};

const toggleTweetLike = async (tweetId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/likes/toggle/t/${tweetId}`,
			{
				method: "POST",
				credentials: "include",
			}
		);
		const res = await response.json();
		console.log("Toggle Tweet Like Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while toggling tweet like :: ", error);
	}
};

const getAllTweetLike = async () => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/likes/tweets`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		const res = await response.json();
		console.log("Toggle Tweet Like Response :: ", res);
		return res;
	} catch (error) {
		console.log("Error while getting all tweet like :: ", error);
	}
};

const getLikedVideos = async () => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/likes/videos",
			{
				method: "GET",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Like Videos Response :: ", result);
		return result;
	} catch (error) {
		console.log("Error while getting like videos :: ", error);
	}
};

const getVideoLikeById = async (videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/likes/videos/${videoId}`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Like Videos Response :: ", result);
		return result;
	} catch (error) {
		console.log("Error while getting like videos :: ", error);
	}
};

export {
	toggleVideoLike,
	toggleCommentLike,
	toggleTweetLike,
	getLikedVideos,
	getAllTweetLike,
	getVideoLikeById,
};
