import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
	userId: string;
	email: string;
	password: string;
	emailVerified: boolean;
	userName: string;
	fullName: string;
	verifyCodeExpiry: Date;
	verifyCode: string;
	createdAt: Date;
	updatedAt: Date;
};

const UserSchema: Schema<User> = new Schema({
	userId: {
		type: String,
		required: [true, "User ID is required"],
		unique: true,
	},
	userName: {
		type: String,
		required: [true, "Username is required"],
		unique: true,
		trim: true,
	},
	fullName: {
		type: String,
		required: [true, "Full Name is required"],
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Email is required"],
		trim: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	emailVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
	verifyCodeExpiry: {
		type: Date,
		required: [true, "Verify Code Expiry is required"],
	},
	verifyCode: {
		type: String,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
