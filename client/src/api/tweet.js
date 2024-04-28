const createTweet = async (data) => {
	try {
		const response = await fetch("http://localhost:8000/api/v1/tweets/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(data),
		});
		const result = await response.json();
		return result.data.tweetDetails;
	} catch (error) {
		console.log("Error while creating tweet :: ", error);
	}
};

const getUserTweets = async () => {
	try {
		const response = await fetch("http://localhost:8000/api/v1/tweets/", {
			method: "GET",
			credentials: "include",
		});
		console.log("Get User Tweet Response :: ", await response.json());
	} catch (error) {
		console.log("Error while getting user tweets :: ", error);
	}
};

const updateTweet = async (content, tweetId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/tweets/${tweetId}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(content),
			}
		);
		console.log("Update Tweet Response :: ", await response.json());
	} catch (error) {
		console.log("Error while updating tweet:: ", error);
	}
};

const deleteTweet = async (tweetId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/tweets/${tweetId}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);
		console.log("Delete Tweet Response :: ", await response.json());
	} catch (error) {
		console.log("Error while deleting tweet :: ", error);
	}
};

export { createTweet, getUserTweets, updateTweet, deleteTweet };
