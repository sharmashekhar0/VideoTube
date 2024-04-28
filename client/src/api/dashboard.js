const getChannelStats = async () => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/dashboard/stats"
		);
		console.log("Channel Stats Response :: ", response);
	} catch (error) {
		console.log("Error while getting channel stats :: ", error);
	}
};

const getChannelVideos = async () => {
	try {
		const response = await fetch("http://localhost:8000/api/v1/");
	} catch (error) {
		console.log("Error while :: ", error);
	}
};

export { getChannelStats, getChannelVideos };
