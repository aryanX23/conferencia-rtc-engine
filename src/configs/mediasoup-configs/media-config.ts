import os from "os";
import {
	TransportListenInfo,
	RtpCodecCapability,
	WorkerLogTag,
} from "mediasoup/node/lib/types";

const mediaCodecs: RtpCodecCapability[] = [
	{
		kind: "audio",
		mimeType: "audio/opus",
		clockRate: 48000,
		channels: 2,
		preferredPayloadType: 111,
		parameters: {
			minptime: 10,
			useinbandfec: 1, // Enable Forward Error Correction
			usedtx: 1, // Enable Discontinuous Transmission
			stereo: 1, // Enable stereo encoding
			"sprop-stereo": 1,
		},
		rtcpFeedback: [
			{ type: "transport-cc" }, // Transport Congestion Control
			{ type: "nack" }, // Negative Acknowledgement
		],
	},
	{
		kind: "video",
		mimeType: "video/VP8",
		clockRate: 90000,
		preferredPayloadType: 96,
		parameters: {
			"x-google-start-bitrate": 800, // Conservative initial bitrate
			"x-google-min-bitrate": 100, // Minimum bitrate for poor networks
			"x-google-max-bitrate": 3000, // Maximum bitrate for good networks
			"x-google-layers": 3, // Enable temporal layers for scalability
		},
		rtcpFeedback: [
			{ type: "transport-cc" }, // Enable congestion control
			{ type: "ccm", parameter: "fir" }, // Full Intra Request
			{ type: "nack" }, // Enable packet loss recovery
			{ type: "nack", parameter: "pli" }, // Picture Loss Indication
			{ type: "goog-remb" }, // Receiver Estimated Max Bitrate
		],
	},
	{
		kind: "video",
		mimeType: "video/H264",
		clockRate: 90000,
		parameters: {
			"packetization-mode": 1,
			"profile-level-id": "42e01f", // Main profile, Level 3.1
			"level-asymmetry-allowed": 1,
			"x-google-start-bitrate": 800,
			"x-google-min-bitrate": 100,
			"x-google-max-bitrate": 3000,
		},
		preferredPayloadType: 97,
		rtcpFeedback: [
			{ type: "transport-cc" },
			{ type: "ccm", parameter: "fir" },
			{ type: "nack" },
			{ type: "nack", parameter: "pli" },
			{ type: "goog-remb" },
		],
	},
];

const webRtcTransportOptions = {
	listenIps: [
		{
			ip: "0.0.0.0",
			announcedIp: "127.0.0.1", // replace by public IP address before hosting
		},
	] as TransportListenInfo[],
	listenIp: "0.0.0.0",
	listenPort: 3016,
};

const workerOptions = {
	numWorkers: Object.keys(os.cpus()).length,
	worker: {
		rtcMinPort: 10000,
		rtcMaxPort: 10100,
		logLevel: "debug",
		logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"] as WorkerLogTag[],
	},
};

export { mediaCodecs, webRtcTransportOptions, workerOptions };
