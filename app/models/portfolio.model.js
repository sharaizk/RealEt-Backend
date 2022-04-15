import { Schema, Types, model } from "mongoose";

const portfolioScheme = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String },
    type: { type: String },
    propertySubType: {
      type: String,
      required: [true, "Property Sub type is required"], //Commercial, Resedentional,Agricultural
    },
    photos: [{ type: String }],
    info: {
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
      yearBuilt: { type: String },
    },
    city: { type: Number, ref: "City" },
    province: { type: Number, ref: "Province" },
    location: { type: Number, ref: "Location" },
    deleteFlag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Portfolio = model("Portfolio", portfolioScheme);
export default Portfolio;
