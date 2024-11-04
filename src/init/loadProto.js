import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import protobuf from "protobufjs";
import { packetNames } from "../protobuf/packetNames.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, "../protobuf");

const getAllProtoFiles = (dir, fileList = []) => {
	const files = fs.readdirSync(dir);
	files.forEach((file) => {
		const filePath = path.join(dir, file);

		// 상태가 디렉토리면 아직 proto 파일까지 못 간거니까 재귀호출로 다시 시도
		if (fs.statSync(filePath).isDirectory()) {
			getAllProtoFiles(filePath, fileList);
		} else if (path.extname(file) === ".proto") {
			fileList.push(filePath);
		}
	});
	return fileList;
};

const protoFiles = getAllProtoFiles(protoDir);

const protoMessages = {};

export const loadProtos = async () => {
	try {
		const root = new protobuf.Root();

		await Promise.all(protoFiles.map((file) => root.load(file)));

		for (const [packetName, types] of Object.entries(packetNames)) {
			protoMessages[packetName] = {};
			for (const [type, typeName] of Object.entries(types)) {
				protoMessages[packetName][type] = root.lookupType(typeName);
			}
		}

		console.log("Protobuf 파일이 로드 되었습니다.");
	} catch (e) {
		console.error("Protobuf 파일 로드 중 오류가 발생했습니다.", e);
	}
};

// protoMessages의 내용물을 밖으로 보내주는 함수
// object가 가지고 있는 freeze라는 기능 이용
export const getProtoMessages = () => {
	return { ...protoMessages };
};
