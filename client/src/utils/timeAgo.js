function timeAgo(createdAt) {
	const currentDate = new Date();
	const timeDifference =
		currentDate.getTime() - new Date(createdAt).getTime();

	const minutes = Math.floor(timeDifference / (1000 * 60));
	const hours = Math.floor(timeDifference / (1000 * 60 * 60));
	const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

	if (days > 0) {
		return `${days} day${days > 1 ? "s" : ""} ago`;
	} else if (hours > 0) {
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else {
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	}
}

export default timeAgo;
