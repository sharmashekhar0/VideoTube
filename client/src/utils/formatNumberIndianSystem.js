function formatNumberIndianSystem(number) {
	const numStr = number?.toString();
	const lastThreeDigits = numStr?.slice(-3);
	const otherDigits = numStr?.slice(0, -3);

	const formattedOtherDigits = otherDigits?.replace(
		/\B(?=(\d{2})+(?!\d))/g,
		","
	);
	const formattedNumber = otherDigits
		? formattedOtherDigits + "," + lastThreeDigits
		: lastThreeDigits;

	return formattedNumber;
}

export default formatNumberIndianSystem;
