import Game from "../classes/models/game.class.js";
import { gameSessions } from "./sessions.js";

// 게임 클래스 생성자가 id 받기 때문에 이 함수에서도 받아 세션 생성해준다
export const addGameSession = (id) => {
	const session = new Game(id);
	gameSessions.push(session);
	return session;
};

// 게임 세션은 한개만 생성된다고 가정하여 0번을 삭제
export const removeGameSession = () => {
	delete gameSessions[0];
};

// 게임 세션은 한개만 생성된다고 가정하여 0번을 가져감
export const getGameSession = () => {
	return gameSessions[0];
};
