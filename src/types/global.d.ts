// types/global.d.ts
import { SocketService, MediasoupService } from "@/configs";
import { Worker } from "mediasoup/node/lib/types";

declare global {
	var SocketService: SocketService;
	var MediasoupService: MediasoupService;
}

export {};
