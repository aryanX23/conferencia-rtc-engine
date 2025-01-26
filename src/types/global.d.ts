// types/global.d.ts
import { SocketService } from "@/configs";
import { Worker } from "mediasoup/node/lib/types";

declare global {
	var socketService: SocketService;
	var mediasoupRouter: Promise<Worker>;
}

export {};
