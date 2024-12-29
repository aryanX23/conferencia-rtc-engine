import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authenticateUser } from "../middlewares/authenticate-user";

const { ORIGIN_URL = "http://localhost:3000" } = process.env || {};

export const configureExpress = () => {
	const app = express();

	app.use(
		cors({
			credentials: true,
			origin: [ORIGIN_URL],
			exposedHeaders: ["authorization", "refresh-token"],
		})
	);

	app.use(helmet());

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	// Middleware to authenticate Customer
	app.use(async (req, res, next) => {
		const unVerifiedRoutes =
			req.path.includes("/users/login") ||
			req.path.includes("/users/register") ||
			req.path.includes("/users/login");

		if (unVerifiedRoutes) {
			return next();
		}
		await authenticateUser(req, res, next);
	});

	// app.use("/api", masterRoute());

	return app;
};
