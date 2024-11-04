import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../constants/env.js";

// 원래 중앙집중식 환경변수 관리 했으나, 지금은 꽤 진행되어 그렇게 하기엔 시간이 오래걸림 - DB관련만 여기에 저장하기로
export const config = {
	database: {
		database: DB_NAME,
		host: DB_HOST,
		password: DB_PASSWORD,
		port: DB_PORT,
		user: DB_USER,
	},
};
