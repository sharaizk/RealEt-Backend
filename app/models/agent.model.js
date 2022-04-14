import { Schema, Types, model } from "mongoose";

const agentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    officeName: { type: String },
    officeCoordinates: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    logo: { type: String },
    ads: [Types.ObjectId],
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
  },

  { timestamps: true }
);

const Agent = model("Agent", agentSchema);
export default Agent;
