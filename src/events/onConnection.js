import { onData } from "./onData.js";
import { onEnd } from "./onEnd.js";
import { onError } from "./onError.js";

export const onConnection = (socket) => {
	console.log(`Client connected from: ${socket.remoteAddress} : ${socket.remotePort}`);

	// 각 클라이언트마다 빈 버퍼객체를 할당해줌
	// 데이터가 쪼개져 청크라는 조각으로 버퍼에 쌓이고 다 차면 버퍼 통쨰로 넘겨주기 때문에 그 빈 버퍼를 만들어주는 것
	socket.buffer = Buffer.alloc(0);

	socket.on("data", onData(socket));
	socket.on("end", onEnd(socket));
	socket.on("error", onError(socket));
};
