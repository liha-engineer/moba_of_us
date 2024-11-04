import { toCamelCase } from "../../utils/transformCase.js";
import dbPool from "../database.js";
import { USER_QUERIES } from "./user.queries.js";

export const findUserByDeviceId = async (deviceId) => {
	const [rows] = await dbPool.query(USER_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
	// dbPool에서 꺼내오니 스네이크 케이스일텐데 우리는 카멜케이스 쓰므로 컨벤션 맞지 않음 - 이걸 위한 함수 utils에 만들것
	return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
	await dbPool.query(USER_QUERIES.CREATE_USER, [deviceId]);
	return { deviceId };
};

// DB에서 뭔가를 반환해주지 않고 에러가 나도 DB내에서 에러처리를 하지, 우리가 뭔가 받아볼 순 없다.
export const updateUserLogin = async (deviceId) => {
    await dbPool.query(USER_QUERIES.UPDATE_USER_LOGIN, [deviceId]);
};

export const updateUserLocation = async (x, y, deviceId) => {
    await dbPool.query(USER_QUERIES.UPDATE_USER_LOCATION, [x, y, deviceId]);
};
