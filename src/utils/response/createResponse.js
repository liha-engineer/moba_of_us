import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from "../../constants/header.js";
import { getProtoMessages } from "../../init/loadProto.js";

export const createResponse = (handlerId, responseCode, data = null) => {
	const protoMessages = getProtoMessages();
	const Response = protoMessages.response.Response;

	const response = {
		handlerId,
		responseCode,
		timestamp: Date.now(),
		// 데이터가 있으면 버퍼객체일테니 가져와 스트링형태로 풀어주고, 없으면 그냥 null 보낼것
		data: data ? Buffer.from(JSON.stringify(data)) : null,
	};

	// buffer객체를 decode로 풀었던것처럼 encode로 만들어줌
	// 다 만들었으면 .finish() 를 붙여 전달 준비 끝을 알림
	const buffer = Response.encode(response).finish();

	// 4바이트짜리 패킷 총 길이만큼의 버퍼사이즈를 미리 할당받아 놓는다
	const packetLength = Buffer.alloc(TOTAL_LENGTH);
	// 버퍼길이 + 총길이 + 패킷타입 길이까지 다 더한 값이 4바이트짜리 총 길이 값으로 write되어야 하므로 이렇게 써준다
	packetLength.writeUInt32BE(buffer.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0);

	// 1바이트짜리 패킷타입을 담는 버퍼사이즈도 미리 할당받아 놓는다
	const packetType = Buffer.alloc(PACKET_TYPE_LENGTH);
	// 지금 처리하는 패킷타입은 NORMAL - 뭔가 response가 있으면 타입이 NORMAL이라고 보면 된다
	packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);

	return Buffer.concat([packetLength, packetType, buffer]);
};
