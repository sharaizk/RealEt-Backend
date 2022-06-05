import { Schema, Types, model } from "mongoose";

const agentSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    officeName: { type: String },

    logo: { type: String },
    ads: [Types.ObjectId],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "verified", "rejected"],
    },
    officeContact: { type: String },
    cnic: [{ type: String }],
    city: { type: Number, ref: "Cities" },
    location: { type: Number, ref: "Location" },
  },

  { timestamps: true }
);

agentSchema.virtual("city_data", {
  ref: "Cities",
  localField: "city",
  foreignField: "key",
  justOne: true,
});
agentSchema.virtual("location_data", {
  ref: "Location",
  localField: "location",
  foreignField: "key",
  justOne: true,
});

const Agent = model("Agent", agentSchema);
export default Agent;
