import { Schema, Types, model } from "mongoose";

const adSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Title is required"] },
    photos: [{ type: String }],
    virtualTour: [{}],
    description: { type: String },
    type: { type: String, required: [true, "Property type is required"] },
    propertySubType: {
      type: String,
      required: [true, "Property Sub type is required"], //Commercial, Resedentional,Agricultural
    },
    info: {
      price: { type: String, required: [true, "Price is required"] },
      coords: { longitude: { type: Number }, latitude: { type: Number } },
      societyName: {
        type: String,
        required: [true, "Society Name is required"],
      },
      block: { type: String },
      sector: { type: String },
      street: { type: String },
      phase: { type: String },
      features: [{ type: String }],
      size: { type: String, required: [true, "Property Size is required"] },
      unit: { type: String, required: [true, "Unit is required"] }, //Marla Kanal
    },
    city: { type: Number, ref: "City" },
    location: { type: Number, ref: "Location" },
    deleteFlag: { type: Boolean, default: false },
    featuredInfo: {
      isFeatured: { type: Boolean, default: false },
      requested: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Ad = model("Ad", adSchema);
export default Ad;
