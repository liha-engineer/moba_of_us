import dbPool from "../../db/database.js";
// 서버가 올라갈 때 풀도 미리 구동되면 좋으니 DB연결 확인용 테스트쿼리 보내는 함수 생성

// 이 함수를 init > index.js에서 호출할 것
export const testQuery = async (pool) => {
	try {
		const [rows] = await dbPool.query("SELECT 1 + 1 AS solution");
		console.log(`테스트 쿼리 결과: ${rows[0].solution}`);
	} catch (e) {
		console.error("테스트 쿼리 실행 오류: ", e);
	}
};
