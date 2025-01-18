// types/global.d.ts
import { SocketService } from "@/configs";

declare global {
	var socketService: SocketService;
}

export {};
