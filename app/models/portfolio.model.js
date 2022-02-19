import { Schema, Types, model } from "mongoose";

const portfolioScheme = new Schema(
  {
    builderId: { type: Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String },
    info: {
      coords: { longitude: { type: Number }, latitude: { type: Number } },
      societyName: {
        type: String,
        required: [true, "Society Name is required"],
      },
    },
    city: { type: Number, ref: "City" },
    province: { type: Number, ref: "Province" },
    location: { type: Number, ref: "Location" },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

const Portfolio = model("Portfolio", portfolioScheme);
export default Portfolio;
