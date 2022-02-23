import { model, Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: String,
    key: { type: String, unique: true },
  },
  { timestamps: true }
);

const Location = model("Location", locationSchema, "locations");

export default Location;
