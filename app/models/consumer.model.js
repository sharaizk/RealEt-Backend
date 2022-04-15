import { model, Schema, Types } from "mongoose";

const consumerSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    ads: [{ type: Types.ObjectId, ref: "Ads" }],
    recentSearches: [String],
    location: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
  },
  { timestamps: true }
);

const Consumer = model("Consumer", consumerSchema);

export default Consumer;
