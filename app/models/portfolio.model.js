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

    size: { type: String, required: [true, "Property Size is required"] },

    yearBuilt: { type: String },

    city: { type: Number, ref: "City" },
    province: { type: Number, ref: "Province" },
    location: { type: Number, ref: "Location" },
    deleteFlag: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

portfolioScheme.virtual("city_data", {
  ref: "Cities",
  localField: "city",
  foreignField: "key",
  justOne: true,
});
portfolioScheme.virtual("location_data", {
  ref: "Location",
  localField: "location",
  foreignField: "key",
  justOne: true,
});
const Portfolio = model("Portfolio", portfolioScheme);
export default Portfolio;
