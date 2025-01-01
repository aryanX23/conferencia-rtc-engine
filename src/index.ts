import dotenv from "dotenv";
import { createServer, Server } from "http";

import { connectDatabase, configureExpress, SocketService } from "@/configs";
const { PORT = 8000 } = process.env || {};

dotenv.config();

// Database Connection
const db = connectDatabase();

db.on("error", (err: Error) => {
	console.log("Mongoose error", err);
});

db.once("open", async () => {
	try {
		// Initialize Express app
		const app = configureExpress();
		const server: Server = createServer(app);

		// Initialize Socket Service
		const socketService = new SocketService(server);

		// Start server
		server.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}!`);
		});

		console.log("Connected to DB!");
		socketService.initListeners();
	} catch (error) {
		console.error("Server initialization failed:", error);
		process.exit(1);
	}
});