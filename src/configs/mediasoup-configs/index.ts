import { createWorker } from "mediasoup";
import { Worker } from "mediasoup/node/lib/types";

class MediasoupService {
	createWorker = async (): Promise<Worker> => {
		const newWorker = await createWorker({
			rtcMinPort: 2000, // Minimum port number for RTC traffic
			rtcMaxPort: 2020, // Maximum port number for RTC traffic
		});

		// Log the worker process ID for reference
		console.log(`Worker process ID ${newWorker.pid}`);

		// Event handler for the 'died' event on the worker
		newWorker.on("died", (error) => {
			console.error("Mediasoup worker has died -> ", error);
			setTimeout(() => {
				process.exit();
			}, 2000);
		});

		return newWorker;
	};
}

export default MediasoupService;
