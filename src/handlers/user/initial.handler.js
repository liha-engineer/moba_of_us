import User from "../../classes/models/user.class.js";
import { HANDLER_IDS } from "../../constants/handlerIds.js";
import { RESPONSE_CODES } from "../../constants/responseCodes.js";
import { createUser, findUserByDeviceId, updateUserLogin } from "../../db/user/user.db.js";
import { getGameSession } from "../../sessions/game.session.js";
import { addUser } from "../../sessions/user.session.js";
import { createResponse } from "../../utils/response/createResponse.js";

// handlers 폴더의 index.js에 필요하다 - 적절한 핸들러 맵핑을 위해
// onData.js에 보면 handler가 { socket, userId, payload } 를 인자로 받는다 - 여기서도 넣어준다
const initialHandler = async ({ socket, userId, payload }) => {
	try {
		const { deviceId,  playerId, latency } = payload;

		let user = await findUserByDeviceId(deviceId);
		let coords = {
			x: 0,
			y: 0,
		};

		if (!user) {
			await createUser(deviceId);
		} else {
			// 유저가 있다면 기존의 x, y 좌표를 업데이트 해줄 것 
			await updateUserLogin(deviceId);
			coords.x = user.xCoord;
			coords.y = user.yCoord;
		}

		// 이 addUser는 유저세션으로 들어가는 것 - DB에 저장되는 것과는 상관이 없다
		user = new User(socket, deviceId, playerId, latency, coords);
		addUser(user)

		const gameSession = getGameSession();
		gameSession.addUserInGameSession(user);

		const initialResponse = createResponse(HANDLER_IDS.INITIAL, RESPONSE_CODES.SUCCESS, {
			userId: deviceId,
			x: user.x,
			y: user.y,
		});

		socket.write(initialResponse);
	} catch (e) {
		console.error(e);
	}
};

export default initialHandler;
