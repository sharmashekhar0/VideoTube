const getVideoComments = async (videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/comments/${videoId}`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Video Comments Response :: ", result);
		return result.data.comments;
	} catch (error) {
		console.log("Error while getting video comments :: ", error);
	}
};

const addComment = async (content, videoId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/comments/${videoId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(content),
			}
		);
		const result = await response.json();
		console.log("Add Comment Response :: ", result);
		return result;
	} catch (error) {
		console.log("Error while adding comment:: ", error);
	}
};

// TODO: Add Buttons to UI and make these api calls
const updateComment = async (content, commentId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/comments/c/${commentId}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(content),
			}
		);
		console.log("Update Comment Response :: ", await response.json());
	} catch (error) {
		console.log("Error while updating comment :: ", error);
	}
};

const deleteComment = async (commentId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/comments/c/${commentId}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);
		console.log("Delete Comment Response :: ", await response.json());
	} catch (error) {
		console.log("Error while deleting comment :: ", error);
	}
};

export { getVideoComments, addComment, updateComment, deleteComment };
