import { Namespace } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { logError, decodeJwtToken } from "@/utils";
import moment from "moment";

const p2pSocketNamespaceController = async (
	p2pSocketNamespace: Namespace<
		DefaultEventsMap,
		DefaultEventsMap,
		DefaultEventsMap,
		any
	>
): Promise<any> => {
	try {
		p2pSocketNamespace
			.use(async (socket, next) => {
				const token = socket.handshake.auth.token;

				const decodedToken = await decodeJwtToken(token);
				const { user: { userId, email } = {}, expires } = decodedToken;

				if (!userId || !email || !expires) {
					return next(new Error("Invalid token"));
				}

				const currenctTimeInUtc = moment.utc().valueOf();
				const tokenExpiryTime = moment(expires).valueOf();

				if (currenctTimeInUtc > tokenExpiryTime) {
					return next(new Error("Token expired"));
				}
				
				

				next();
			})
			.on("connection", (socket) => {
				console.log("New P2P Connection established -> ", socket.id);

				socket.on("join-room", (data) => {
					console.log("Joining room -> ", data);
					socket.join(data.roomId);
				});

				socket.on("leave-room", (data) => {
					console.log("Leaving room -> ", data);
					socket.leave(data.roomId);
				});

				socket.on("send-message", (data) => {
					socket
						.to(data.roomId)
						.emit("receive-message", data?.newMessage || "");
				});
			});
	} catch (error) {
		console.log("Error in P2P Socket Namespace handler -> \n");
		logError(error as Error);
	}
};

export default p2pSocketNamespaceController;
