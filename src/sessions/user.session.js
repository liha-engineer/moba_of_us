import { updateUserLocation } from "../db/user/user.db.js";
import { userSessions } from "./sessions.js";

// 하나하나 추가해줘도 되지만 유저를 통째로 받자
export const addUser = (user) => {
	userSessions.push(user);
	return user;
};

// 이 removeUser는 유저가 로그아웃 하는 것 - game.class.js의 removeUser는 게임세션에서 유저를 제외시키는 것 (유저 이탈)
export const removeUser = async (socket) => {
	const index = userSessions.findIndex((user) => user.socket === socket);
	if (index !== -1) {
		const user = userSessions[index]
		// 세션에서 유저가 삭제될 때 그 마지막 순간의 x, y좌표를 기억하면 될것 같아 여기에서 함수 호출
		await updateUserLocation(user.x, user.y, user.id)
		return `User removed : ${userSessions.splice(index, 1)[0]}`;
	}
};


export const getAllUser = () => {
	return userSessions;
};
