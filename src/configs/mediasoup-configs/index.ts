import * as mediasoup from "mediasoup";
import { Worker } from "mediasoup/node/lib/types";

class MediasoupService {
	constructor() {}

	createWorker = async (): Promise<Worker> => {
		const newWorker = await mediasoup.createWorker({
			rtcMinPort: 10000, // Minimum port number for RTC traffic
			rtcMaxPort: 10100, // Maximum port number for RTC traffic
		});

		// Log the worker process ID for reference
		console.log(`Worker process ID ${newWorker.pid}`);

		// Event handler for the 'died' event on the worker
		newWorker.on("died", (error) => {
			console.error("Mediasoup worker has died -> ", error);
			setTimeout(() => {
				process.exit(1);
			}, 2000);
		});

		return newWorker;
	};
}

export default MediasoupService;
