import { DefaultEventsMap, Namespace, Server } from "socket.io";
import { Server as HttpServerType } from "http";

const ORIGIN_URL = process.env.ORIGIN_URL ?? "http://localhost:3000";

export default class SocketService {
	private _io: Server;
	private socketRouteMap: {
		[key: string]: Namespace<
			DefaultEventsMap,
			DefaultEventsMap,
			DefaultEventsMap,
			any
		>;
	};

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
		this.socketRouteMap = {};
		console.log("Socket Init Successful...");
	}

	getIO(): Server {
		return this._io;
	}

	getSocketRouteMap(routeKey: string): Namespace<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap,
		any
		>{
		return this.socketRouteMap[routeKey];
	}

	initListeners(): void {
		console.log("Initializing Socket Listeners..");
		const io = this.getIO();

		// Instantiating Namespaces Route Map
		this.socketRouteMap = {
			"p2p-mediasoup-route": io.of("/mediasoup/p2p/"),
		};
	}
}
