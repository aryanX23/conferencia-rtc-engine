import { Server } from "socket.io";

const ORIGIN_URL = process.env.ORIGIN_URL ?? "http://localhost:3000";

export class SocketService {
	public _io: Server;

	constructor() {
		this._io = new Server({
			cors: {
				allowedHeaders: ["*"],
				origin: [ORIGIN_URL],
			},
		});
		console.log("Socket Init Successful...");
	}

	getIO(): Server | null {
		return this._io;
	}

	initListeners(): void {
		const io = this._io;
		console.log("Initializing Socket Listeners..");

		io?.on("connection", (socket) => {
			console.log("User connected", socket.id);
		});
	}
}
