import dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";

dotenv.config();

const { MONGO_URI = "mongodb://localhost:27017" } = process.env || {};

// Set Mongoose Promise to global Promise
mongoose.Promise = global.Promise;

const mongooseOptions: mongoose.ConnectOptions = {
	// Add any mongoose options you need here
	// For example:
	// useNewUrlParser: true,
	// useUnifiedTopology: true,
};

export const connectDatabase = (): Connection => {
	mongoose.connect(MONGO_URI, mongooseOptions);
	const db = mongoose.connection;

	// Optional: Add error and connection handling
	db.on("error", (error) => {
		console.error("MongoDB connection error:", error);
	});

	db.once("open", () => {
		console.log("Connected to MongoDB");
	});

	return db;
};

export default connectDatabase;
