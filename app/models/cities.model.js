import { model, Schema } from "mongoose";
const citySchema = new Schema(
  {
    name: String,
    longitude: Number,
    latitude: Number,
    key: { type: Number, unique: true },
  },
  { timestamps: true }
);

const Cities = model("Cities", citySchema, "cities");
export default Cities;
