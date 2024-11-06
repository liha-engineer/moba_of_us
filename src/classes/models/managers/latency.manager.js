class LatencyManager {
	constructor() {
		this.intervals = new Map();
	}

	addUserInLatencyManager(userId, callback, timestamp) {
		if (this.intervals.has(userId)) {
			console.error("중복된 인터벌이 확인됩니다.");
		}
		this.intervals.set(userId, setInterval(callback, timestamp));
	}

	removeUser(userId) {
		if (!this.intervals.has(userId)) {
			return;
		}
		clearInterval(this.intervals.get(userId));
	}

    // 이 메서드는 마지막 사람이 세션에서 나갈 때 실행해주면 좋을 듯
	clearAll() {
        // Map 속 interval들을 지워준다
		this.intervals.forEach((interval) => {
			clearInterval(interval);
		});
        // Map도 깨끗하게 지워준다
		this.intervals.clear();
	}
}

export default LatencyManager;
