import { getGameSession } from "../sessions/game.session.js";
import { removeUser } from "../sessions/user.session.js";

export const onEnd = (socket) => async () => {
    console.log('클라이언트 연결이 종료되었습니다')

    // 유저 목록에서 소켓으로 찾아내 삭제
    await removeUser(socket);

    // 게임 세션에서도 해당 유저 제거
    const gameSession = getGameSession()
    gameSession.removeUser(socket);
};
