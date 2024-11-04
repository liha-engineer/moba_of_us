// JS 상에서 좀 편안하게 읽기 위해 만든 맵핑 파일
// JS는 proto 파일에 접근못하기 때문에 이게 필요함
// 패키지이름 : {메시지 이름 : '풀네임'} 순으로 적혀있음

export const packetNames = {
	common: {
		Packet: "common.Packet",
	},
	initial: {
		InitialPayload: "initial.InitialPayload",
	},
	game: {
		LocationUpdatePayload: "game.LocationUpdatePayload",
	},
	response: {
		Response: "response.Response",
	},
	gameNotification: {
		LocationUpdate: "gameNotification.LocationUpdate",
	},
};
