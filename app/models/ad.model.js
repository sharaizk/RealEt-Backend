import { Schema, Types, model } from "mongoose";

const adSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Title is required"] },
    photos: [{ type: String }],
    virtualTour: [{}],
    description: { type: String },
    type: { type: String, required: [true, "Property type is required"] },
    info: {
      price: { type: String, required: [true, "Price is required"] },
      coords: { longitude: { type: Number }, latitude: { type: Number } },
      societyName: {
        type: String,
        required: [true, "Society Name is required"],
      },
      city: { type: String, required: [true, "City is required"] },
      province: { type: String, required: [true, "Province is required"] },
      size: { type: String, required: [true, "Property Size is required"] },
      unit: { type: String, required: [true, "Unit is required"] },
      deleteFlag: { type: Boolean, default: false },
      featuredFlag: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Ad = model("Ad", adSchema);
export default Ad;
