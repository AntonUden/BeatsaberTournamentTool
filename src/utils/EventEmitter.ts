export class EventEmitter {
	private events: Record<string, EventCallback[]> = {};

	constructor() {
		this.events = {};
	}

	on(eventName: string, callback: EventCallback) {
		if (!this.events[eventName]) {
			this.events[eventName] = [];
		}
		this.events[eventName].push(callback);
	}

	off(eventName: string, callback: EventCallback) {
		if (this.events[eventName]) {
			this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
		}
	}

	emit(eventName: string, ...args: any[]) {
		if (this.events[eventName]) {
			this.events[eventName].forEach((callback) => {
				callback(...args);
			});
		}
	}
}

type EventCallback = (...args: any[]) => void;