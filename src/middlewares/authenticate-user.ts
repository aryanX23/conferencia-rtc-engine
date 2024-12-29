import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { isUndefined, isEmpty } from "lodash-es";

dotenv.config();

const {
	ACCESS_TOKEN_SECRET = "testaccesstoken",
	REFRESH_TOKEN_SECRET = "testrefreshtoken",
} = process.env || {};

interface TokenDetails {
	userId?: string;
	email?: string;
	isTokenRefreshed?: boolean;
	accessTokenActive?: boolean;
}

function verifyJWT(accessToken: string, refreshToken: string): TokenDetails {
	let userDetails = {};
	try {
		userDetails = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
		return { ...userDetails, accessTokenActive: true };
	} catch (err: any) {
		if (err?.name === "TokenExpiredError") {
			userDetails = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
			return { ...userDetails, isTokenRefreshed: true };
		}
		return userDetails;
	}
}

const generateJwt = (
	tokenDetails: TokenDetails,
	secret: string,
	expiresIn: string
): string => {
	return jwt.sign(tokenDetails, secret, { expiresIn });
};

export async function authenticateUser(req: any, res: any, next: any) {
	try {
		const accessToken = req.headers.authorization.split(" ")[1];
		const refreshToken = req.headers["refresh-token"];

		if (isUndefined(accessToken) || isUndefined(refreshToken)) {
			return res.status(401).send({
				message: "Unauthorized",
			});
		}

		const tokenDetails = verifyJWT(accessToken, refreshToken);

		if (isEmpty(tokenDetails)) {
			throw new Error("Unauthorized");
		}

		const { isTokenRefreshed = false, accessTokenActive = false } =
			tokenDetails;

		if (isTokenRefreshed) {
			const newAccessToken = generateJwt(
				{ userId: tokenDetails?.userId, email: tokenDetails?.email },
				ACCESS_TOKEN_SECRET,
				"1h"
			);
			req["userDetails"] = {
				userId: tokenDetails?.userId,
				email: tokenDetails?.email,
			};

			res.setHeader("authorization", "Bearer " + newAccessToken);
		} else if (!accessTokenActive) {
			res.setHeader("refresh-token", false);
		}

		req["userDetails"] = {
			userId: tokenDetails?.userId,
			email: tokenDetails?.email,
		};
		next();
	} catch (err) {
		return res.status(401).send({
			message: "Unauthorized",
		});
	}
}

export { verifyJWT, generateJwt };
