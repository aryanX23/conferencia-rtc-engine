import mongoose, { Schema, Document } from "mongoose";

export interface Meeting extends Document{
  meetingId: string;
	meetingOwnerId: string;
	meetingOwnerUsername: string;
  meetingCapacity: string;
  createdAt: Date;
  updatedAt: Date;
  meetingDuration?: Date;
}

const MeetingSchema: Schema<Meeting> = new Schema({
  meetingId: {
		type: String,
		required: [true, "Meeting ID is required"],
		unique: true,
	},
	meetingOwnerId: {
		type: String,
		required: [true, "Meeting Owner Id is required"],
		trim: true,
	},
	meetingOwnerUsername: {
		type: String,
		required: [true, "Meeting Owner Name is required"],
		trim: true,
  },
  meetingCapacity: {
    type: String,
    enum: ["P2P", "GROUP"],
    default: "P2P"
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
  meetingDuration: {
		type: Date,
		default: Date.now,
	},
});

const MeetingModel = (mongoose.models.Meeting as mongoose.Model<Meeting>) || mongoose.model<Meeting>("Meeting", MeetingSchema);
export default MeetingModel;