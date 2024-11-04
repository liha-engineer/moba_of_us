import { getGameSession } from "../../sessions/game.session.js";

const locationUpdateHandler = ({ socket, userId, payload }) => {
	try {
		const { x, y } = payload;
		const gameSession = getGameSession();

		if (!gameSession) {
			console.error("게임 세션이 존재하지 않습니다.");
		}
		console.log("gameSession?: ", gameSession);

		const user = gameSession.getUser(userId);
		if (!user) {
			console.error("게임세션에 해당 유저가 존재하지 않습니다.");
		}
		user.updateLocation(x, y);
		// 이건 그냥 배열이고 바이트배열이 아니므로 이대로 보내줘봐야 제대로 된 전송 일어나지 않음
		const locationData = gameSession.getAllLocation(userId);

		socket.write(locationData);
	} catch (e) {
		console.error(e);
	}
};

export default locationUpdateHandler;
