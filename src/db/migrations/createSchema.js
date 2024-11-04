import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dbPool from "../user/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSchemas = async () => {
	const sqlDir = path.join(__dirname, "../sql");
	try {
		const sql = fs.readFileSync(sqlDir + "/user_db.sql", "utf8");

		// SQL 쿼리가 여러개일 수 있으니 세미콜론으로 분리, trim으로 빈칸 제거, filter로 길이 0 이상인 것들로만 걸러줌
		const queries = sql
			.split(";")
			.map((query) => query.trim())
			.filter((query) => query.length > 0);

		for (const query of queries) {
			await dbPool.query(query);
		}
	} catch (e) {
		console.error("데이터베이스 마이그레이션 에러: ", e);
	}
};

createSchemas()
	.then(() => {
		console.log("마이그레이션이 완료 되었습니다.");
	})
	.catch((e) => {
		console.error(e);
	});

