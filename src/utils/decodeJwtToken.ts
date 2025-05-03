import { decode } from "next-auth/jwt";

import { logError, logger } from "@/utils";

type DecodedToken = {
	user: {
		userId: string;
		email: string;
	};
	expires: string;
};

const decodeJwtToken = async (token: string) => {
	try {
		const decodedToken = await decode({
			token,
			secret: process.env.NEXT_PUBLIC_AUTH_SECRET || "",
		});

		return decodedToken as DecodedToken;
	} catch (error) {
		logError(error as Error);
		logger.error(error as Error);
		return {} as DecodedToken;
	}
};

export { decodeJwtToken };
