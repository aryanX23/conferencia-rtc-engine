import { Server } from "socket.io";
import { Server as HttpServerType } from "http";

const ORIGIN_URL = process.env.ORIGIN_URL ?? "http://localhost:3000";

export default class SocketService {
	private _io: Server;

	constructor(server: HttpServerType) {
		this._io = new Server(server, {
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

	getIO(): Server {
		return this._io;
	}

	initListeners(): void {
		console.log("Initializing Socket Listeners..");
		const io = this.getIO();

		// Instantiating Namespaces
		// const peerConnectionNamespace = io.of("/api/mediasoup");

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
