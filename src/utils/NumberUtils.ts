export default class NumberUtils {
	static getOrdinal(number: number): string {
		if (number === 0) {
			return "0th";
		}

		const lastDigit = number % 10;
		const lastTwoDigits = number % 100;

		if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
			return number + "th";
		}

		switch (lastDigit) {
			case 1:
				return number + "st";
			case 2:
				return number + "nd";
			case 3:
				return number + "rd";
			default:
				return number + "th";
		}
	}
}