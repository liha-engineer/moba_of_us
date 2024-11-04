import net from "net";
import { HOST, PORT } from "./constants/env.js";
import { onConnection } from "./events/onConnection.js";
import initServer from "./init/index.js";

const server = net.createServer(onConnection);

initServer()
	.then(() => {
		server.listen(PORT, HOST, () => {
			console.log(`Server is running on ${HOST}:${PORT}`);
		});
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
