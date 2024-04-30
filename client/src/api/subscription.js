const toggleSubscription = async (channelId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
			{
				method: "POST",
				credentials: "include",
			}
		);
		const result = await response.json();
		console.log("Toggle Subscription Response :: ", result);
		return result;
	} catch (error) {
		console.log("Error while toggling subscription :: ", error);
	}
};

const getUserChannelSubscribers = async (channelId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/subscriptions/c/${channelId}`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		console.log(
			"Get User Channel Subscribers Response :: ",
			await response.json()
		);
	} catch (error) {
		console.log("Error while getting user channel subscribers:: ", error);
	}
};

const getSubscribedChannels = async (subscriberId) => {
	try {
		const response = await fetch(
			`http://localhost:8000/api/v1/subscriptions/u/${subscriberId}`,
			{
				method: "GET",
				credentials: "include",
			}
		);
		console.log(
			"Get Subscribed Channels Response :: ",
			await response.json()
		);
	} catch (error) {
		console.log("Error while getting subscribed channels :: ", error);
	}
};

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
