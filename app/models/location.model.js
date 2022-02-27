import { model, Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: String,
    key: { type: String, unique: true },
    city: { type: Number, ref: "cities" },
  },
  { timestamps: true }
);

const Location = model("Location", locationSchema, "locations");

export default Location;
