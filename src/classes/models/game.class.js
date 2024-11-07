import { PACKET_TYPE } from "../../constants/header.js";
import { createLocationPacket } from "../../utils/notification/game.notification.js";

class Game {
	constructor(id) {
		this.id = id;
		this.users = [];
	}

	addUserInGameSession(user) {
		this.users.push(user);
	}

	getUserInGameSession(userId) {
		return this.users.find((user) => user.id === userId);
	}
	// userId로 찾는게 일반적이긴 하나 socket으로도 특정되므로 찾을 수 있다
	// 게임 세션에서 유저를 제외되는 것(유저가 게임을 떠났다던지) - 엄밀히는 유저가 로그아웃 하는 것과는 좀 다름
	removeUser(socket) {
		const index = this.users.findIndex((user) => user.socket === socket);
		if (index !== -1) {
			return `User removed : ${this.users.splice(index, 1)[0]}`;
		}
	}

	// 여기서 받는 userId는 제외할 user의 ID - 나 빼고 나머지 유저의 위치를 받기 위함
	getAllLocation(userId) {
		const locationData = this.users
			// 나 빼고 나머지의 데이터만 갱신받기 위해 필터 걸기
			.filter((user) => user.id !== userId)
			// 나를 뺀 나머지 유저의 데이터 중 갱신받을 데이터 목록
			.map((user) => {
				console.log('map이 잘 돌아가나?!')
				return { id: user.id, playerId: user.playerId, x: user.x, y: user.y };
			});

			console.log('locationData 잘 나오나?', locationData)

		// 이 메서드의 결과값을 바이트배열로 직렬화 해줄 함수가 필요함
		return createLocationPacket(locationData);
	}
}

export default Game;
