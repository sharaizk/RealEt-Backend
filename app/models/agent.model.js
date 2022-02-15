import { Schema, Types, model } from "mongoose";

const agentSchema = new Schema(
  {
    officeName: { type: String },
    officeCoordinates: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    logo: { type: String },
    ads: [Types.ObjectId],
  },
  { timestamps: true }
);

const Agent = model("Agent", agentSchema);
export default Agent;
