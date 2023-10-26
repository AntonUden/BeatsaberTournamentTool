export default function deepCompareObject(obj1: any, obj2: any): boolean {
	if (obj1 === obj2) {
		return true;
	}

	if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
		return false;
	}

	if (typeof obj1 !== 'object') {
		return obj1 === obj2;
	}

	if (Array.isArray(obj1) !== Array.isArray(obj2)) {
		return false;
	}

	if (Array.isArray(obj1)) {
		if (obj1.length !== obj2.length) {
			return false;
		}

		for (let i = 0; i < obj1.length; i++) {
			if (!deepCompareObject(obj1[i], obj2[i])) {
				return false;
			}
		}
	} else {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			if (!deepCompareObject(obj1[key], obj2[key])) {
				return false;
			}
		}
	}

	return true;
}