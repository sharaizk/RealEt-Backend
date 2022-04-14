import { Schema, Types, model } from "mongoose";

const builderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    officeName: { type: String },
    officeCoordinates: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    logo: { type: String },
    portfolio: [Types.ObjectId],
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
    },
    officeContact: { type: String },
  },
  { timestamps: true }
);

const Builder = model("Builder", builderSchema);
export default Builder;
