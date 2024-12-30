import { Server } from "socket.io";

const ORIGIN_URL = process.env.ORIGIN_URL ?? "http://localhost:3000";

export class SocketService {
	public _io: Server;

	constructor() {
		this._io = new Server({
			cors: {
				origin: [ORIGIN_URL],
				methods: ["GET", "POST"],
				allowedHeaders: ["*"],
				credentials: false,
			},
			transports: ["websocket", "polling"],
			allowEIO3: true,
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

			socket.on("join-room", (roomId, userId) => {
				console.log("join room called -> ", roomId, userId);
				socket.join(roomId);
				socket.to(roomId).emit("user-connected", userId);

				socket.on("disconnect", () => {
					console.log("User disconnected ", userId);
					socket.to(roomId).emit("user-disconnected", userId);
				});
			});
		});
	}
}
