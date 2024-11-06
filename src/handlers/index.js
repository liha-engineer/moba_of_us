import { HANDLER_IDS } from "../constants/handlerIds.js";
import locationUpdateHandler from "./game/locationUpdate.handler.js";
import initialHandler from "./user/initial.handler.js";


const handlers = {
	[HANDLER_IDS.INITIAL]: {
		// 프로토(프로토콜 버퍼)의 타입을 말하는 것 - packetNames.js 의 그 풀네임
		protoType: "initial.InitialPayload",
		handler: initialHandler,
	},

	[HANDLER_IDS.LOCATION_UPDATE]: {
		// 프로토(프로토콜 버퍼)의 타입을 말하는 것 - packetNames.js 의 그 풀네임
		protoType: "game.LocationUpdatePayload",
		handler: locationUpdateHandler,
	},
};

export const getHandlerById = (handlerId) => {
	if (!handlers[handlerId]) {
		throw Error(`해당 ID의 핸들러가 존재하지 않습니다 : ${handlerId}`);
	}

	return handlers[handlerId].handler;
};

// 핸들러ID로 프로토의 타입이름을 가져올 수 있는 메서드를 하나 만들어주자 - 패킷 파서에서 쓸 것
export const getProtoTypeNameByHandlerId = (handlerId) => {
	if (!handlers[handlerId]) {
		throw Error("핸들러 ID에 맞는 프로토콜 버퍼의 이름이 존재하지 않습니다");
	}

	return handlers[handlerId].protoType;
};
