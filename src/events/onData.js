import { PACKET_TYPE, PACKET_TYPE_LENGTH, TOTAL_LENGTH } from "../constants/header.js";
import { getHandlerById } from "../handlers/index.js";
import { packetParser } from "../utils/parser/packetParser.js";

// 두 인자 다 쓰기 위해 currying으로 따로따로 받는다
export const onData = (socket) => (data) => {
	// 소켓버퍼에 데이터 청크가 들어온다면 차곡차곡 쌓일 것이므로 합쳐준다
	socket.buffer = Buffer.concat([socket.buffer, data]);

	// 전체길이 (4바이트) + 패킷타입 (1바이트) = 5바이트짜리였던 그 헤더길이
	const totalHeaderLength = TOTAL_LENGTH + PACKET_TYPE_LENGTH;

	// 버퍼 길이가 헤더 길이보다 길다면 데이터가 뭔가 들어오고 있단 얘기니까 데이터 받길 기다려야 한다
	while (socket.buffer.length > totalHeaderLength) {
		// 4바이트짜리 전체길이를 나타내는 것이니 32비트를 읽는다
		const length = socket.buffer.readUInt32BE(0);
		// 1바이트짜리 패킷타입 - 4바이트만큼 지나고 1바이트 읽어야 하므로 오프셋이 TOTAL_LENGTH
		const packetType = socket.buffer.readUInt8(TOTAL_LENGTH);

		// 버퍼의 길이가 원하는 길이 이상이라면 데이터 다 들어왔으니 이제 파싱해서 원하는대로 쓸 준비
		if (socket.buffer.length >= length) {
			// 헤더만큼은 필요없으니 헤더 이후부터 길이 끝까지 - 내가 용건있는 패킷부분만 추출할 것
			const packet = socket.buffer.subarray(totalHeaderLength, length);
			// 혹시 패킷 자르고 남은 부분이 있을수 있으니 한번 더 잘라서 되돌려줌 - 야 남은거 가져가
			socket.buffer = socket.buffer.subarray(length);
			try {
				// 패킷 타입별로 어떤 식으로 처리되는지 - 스위치문으로 정리
				switch (packetType) {
					case PACKET_TYPE.NORMAL: {
						// 이 안에 패킷파서가 들어갈 것
						const { handlerId, userId, payload } = packetParser(packet);

						const handler = getHandlerById(handlerId);
						handler({ socket, userId, payload });
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
	}
};
