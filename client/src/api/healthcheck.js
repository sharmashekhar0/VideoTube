const healthCheck = async () => {
	try {
		const response = await fetch(
			"http://localhost:8000/api/v1/health-check"
		);
		console.log("Health Check Response :: ", response);
	} catch (error) {
		console.log("Error while checking health :: ", error);
	}
};

export { healthCheck };
