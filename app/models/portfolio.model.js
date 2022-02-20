import { Schema, Types, model } from "mongoose";

const portfolioScheme = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String },
    type: { type: String },
    photos: [{ type: String }],
    info: {
      coords: { longitude: { type: Number }, latitude: { type: Number } },
      societyName: {
        type: String,
        required: [true, "Society Name is required"],
      },

      size: { type: String },
      unit: { type: String },
    },
    city: { type: Number, ref: "City" },
    province: { type: Number, ref: "Province" },
    location: { type: Number, ref: "Location" },
    photos: [{ type: String }],
    deleteFlag: { type: Boolean, default: false },
    city: { type: Number, ref: "City" },
    province: { type: Number, ref: "Province" },
    location: { type: Number, ref: "Location" },
  },
  { timestamps: true }
);

const Portfolio = model("Portfolio", portfolioScheme);
export default Portfolio;
