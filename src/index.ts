import dotenv from "dotenv";
import http from "http";
import { Server } from "http";

import { connectDB } from "./configs/mongoose-configs";
import { SocketService } from "./configs/socket-configs";
import { configureExpress } from "./configs/express-configs";

const { PORT = 8000 } = process.env || {};

dotenv.config();

// Database Connection
const db = connectDB();

db.on("error", (err: Error) => {
	console.log("Mongoose error", err);
});

db.once("open", async () => {
	try {
		// Initialize Express app
		const app = configureExpress();
		const server: Server = http.createServer(app);

		// Initialize Socket Service
		const socketService = new SocketService();
		socketService._io.attach(server);

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

// Rest of the error handling code...
