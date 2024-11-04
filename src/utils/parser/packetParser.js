import { CLIENT_VERSION } from "../../constants/env.js";
import { getProtoTypeNameByHandlerId } from "../../handlers/index.js";
import { getProtoMessages } from "../../init/loadProto.js";

export const packetParser = (data) => {
	const protoMessages = getProtoMessages();

	// 내가 필요한 패킷을 꺼낸다 - 공통패킷의 패키지 이름이 common이고 메시지 이름이 Packet으로 되어있기 때문에 이렇게 쓴다 (packetNames.js 볼것)
	const Packet = protoMessages.common.Packet;
	// 파싱 끝나면 소문자 패킷에다 파싱한 데이터 넣어줄것임
	let packet;
	try {
		packet = Packet.decode(data);
	} catch (e) {
		console.error(e);
	}

	// 이 구조 기억안나면 common.proto 볼것 (payload는 아래에서 파싱할 것)
	const handlerId = packet.handlerId;
	const userId = packet.userId;
	const clientVersion = packet.version;

	// 클라가 보내준 버전과 서버가 가진 버전이 다르다면 에러를 던진다
	if (clientVersion !== CLIENT_VERSION) {
		throw Error("클라이언트 버전이 일치하지 않습니다");
	}

	const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
	if (!protoTypeName) {
		throw Error("해당하는 핸들러 ID에 맞는 프로토타입 이름이 존재하지 않습니다");
	}

	// proto의 타입 이름이 initial.InitialPayload 이런 식으로 구분되어 있어 . 기준으로 찢어줄것
	const [namespace, typeName] = protoTypeName.split(".");
	const payloadType = protoMessages[namespace][typeName];

	// 페이로드도 이런 식으로 파싱해줄 것
	let payload;
	try {
		// 패킷에 담긴 정보 중 페이로드를 파싱 안하고 있었기 때문에 파싱해서 디코딩하고 payload에 넣어주겠다는 것
		payload = payloadType.decode(packet.payload);
	} catch (e) {
		console.error(e);
	}

	// 페이로드 디코딩 했는데 뭔가가 누락되어 있을 수 있다
	// 내가 받길 기대하는 필드들
	const expectedFields = Object.keys(payloadType.fields);
	// 실제로 페이로드에 들어있는 필드들
	const actualFields = Object.keys(payload);
	// 누락된 필드들
	const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

	if (missingFields > 0) {
		throw Error(`필수 필드 중 누락이 존재합니다. ${missingFields}`);
	}

	// 검증 다 끝났으면 파싱한 핸들러id, 유저id, 페이로드를 반환해줌
	return { handlerId, userId, payload };
};
