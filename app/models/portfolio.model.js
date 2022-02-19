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
      city: { type: String },
      province: { type: String },
      size: { type: String },
    },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

const Portfolio = model("Portfolio", portfolioScheme);
export default Portfolio;
