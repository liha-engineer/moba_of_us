import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from "../../constants/header.js";
import { getProtoMessages } from "../../init/loadProto.js";

// 그냥 전달해주면 안되고 패킷으로 만들어 전달해줘야 하니 헤더붙이고 버퍼로 만드는 함수 생성
const serializeData = (message, type) => {
	const packetLength = Buffer.alloc(TOTAL_LENGTH);
	packetLength.writeUInt32BE(message.length + TOTAL_LENGTH + PACKET_TYPE_LENGTH, 0)

	const packetTypeLength = Buffer.alloc(PACKET_TYPE_LENGTH)
	packetTypeLength.writeUInt8(type, 0)

	return Buffer.concat([packetLength, packetTypeLength, message])
}

// 위치 업데이트 패킷을 주고받으려면 x, y가 들은 배열이 바이트배열이 되어야 하므로 새로운 함수 생성
// 인자로는 유저들의 x, y 좌표 배열을 받음
export const createLocationPacket = (users) => {
	const protoMessages = getProtoMessages();

	// 패킷이름 기억 안나면 packetNames.js 볼 것
	const location = protoMessages.gameNotification.LocationUpdate;

	// 이거 왜 users냐면 game.notification.proto에서 repeated 구문에 걸려있는 배열 이름이 users임
	const payload = { users };
	const message = location.create(payload);
	const locationPacket = location.encode(message).finish()

	// 여기도 헤더랑 만들어서 붙여줘야 하므로 serializeData 함수를 만들고 그 결과값을 반환해준다
	return serializeData(locationPacket, PACKET_TYPE.LOCATION);
};