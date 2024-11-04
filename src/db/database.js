import mysql from "mysql2/promise";
import { config } from "../config/config.js";
import { formatDate } from "../utils/dateFormatter.js";

const createPool = () => {
	const pool = mysql.createPool({
		...config.database,
		waitForConnections: true,
		connectionLimit: 5,
		queueLimit: 0,
	});

	// 풀을 통해서 쿼리를 실행했을 때 쿼리에 대한 로그를 찍고 싶다
	const originalQuery = pool.query;

	// 여기서 쿼리 재정의 함 - 호출 시 에러 발생하면 여기서 에러처리 해줄 수도 있을 것 
	pool.query = (sql, params) => {
		const date = new Date();
		console.log(
			`[${formatDate(date)}] Executing query: ${sql} ${params ? `${JSON.stringify(params)}` : ``}`
		);

		return originalQuery.call(pool, sql, params);
	};

	return pool;
};

const dbPool = createPool();

export default dbPool;
