import * as mediasoup from "mediasoup";
import { Router, Worker } from "mediasoup/node/lib/types";

import { workerOptions } from "@/configs/mediasoup-configs/media-config";

class MediasoupService {
	constructor() { };

	worker: Array<{
		worker: Worker
		router: Router
	}> = [];
	
	nextMediasoupWorkerIndex = 0;

	createWorker = async (): Promise<Worker> => {
		const newWorker = await mediasoup.createWorker({
			logLevel: workerOptions.worker.logLevel,
			logTags: workerOptions.worker.logTags,
			rtcMinPort: workerOptions.worker.rtcMinPort,
			rtcMaxPort: workerOptions.worker.rtcMaxPort,
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
