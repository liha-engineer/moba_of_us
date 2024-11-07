import { getGameSession } from "../../sessions/game.session.js";

// onData에서 handler({ socket, userId, payload }) 로 호출되기 때문에 같은걸 넣어준다
const locationUpdateHandler = ({ socket, userId, payload }) => {
try {
	// 해당 게임세션에 참여한 유저의 위치 = 나의 위치
	const { x, y } = payload;
	const gameSession = getGameSession();

	if(!gameSession) {
		console.error('게임 세션이 존재하지 않습니다.');
	}

	console.log('gameSession?: ', gameSession)

	const user = gameSession.getUserInGameSession(userId);
	if(!user) {
		console.error('게임세션에 유저가 존재하지 않습니다.')
	}

	user.updateLocation(x, y);

	// 나를 제외한 나머지 유저들의 위치정보를 가져오는 데이터 
	const locationData = gameSession.getAllLocation(userId);
	socket.write(locationData)

} catch (e) {
	console.error(e)
}
};

export default locationUpdateHandler;
