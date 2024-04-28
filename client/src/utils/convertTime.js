function convertTimeToHHMMSS(timeInSeconds) {
	const hours = Math.floor(timeInSeconds / 3600);
	const minutes = Math.floor((timeInSeconds % 3600) / 60);
	const seconds = Math.floor(timeInSeconds % 60);

	// Format the time
	const formattedHours =
		hours > 0 ? String(hours).padStart(2, "0") + ":" : "";
	const formattedMinutes = String(minutes).padStart(2, "0");
	const formattedSeconds = String(seconds).padStart(2, "0");

	return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}

export default convertTimeToHHMMSS;
