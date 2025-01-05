import { MediasoupService, SocketService } from "@/configs";
import { logError } from "@/utils";
import { Worker } from "mediasoup/node/lib/types";

const socketInstance: SocketService = global.socketService;
const p2pSocketNamespace = socketInstance.getSocketRouteMap(
	"p2p-mediasoup-namespace"
);

const p2pSocketNamespaceController = async (): Promise<any> => {
  try {
    const mediasoupInstance = new MediasoupService();
    let worker: Worker;
    let router;

    p2pSocketNamespace.on
    

	} catch (error) {
		console.log("Error in P2P Socket Namespace handler -> \n");
		logError(error as Error);
	}
};

export default p2pSocketNamespaceController;
