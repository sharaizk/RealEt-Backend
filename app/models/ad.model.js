import { Schema, Types, model } from "mongoose";

const adSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Title is required"] },
    photos: [{ type: String }],
    virtualTour: [{}],
    description: { type: String },
    type: { type: String, required: [true, "Property type is required"] }, //Plot or House or Plaza
    propertyIntent: {
      type: String,
      required: [true, "Property type is required"],
    }, //Sale Or Rent
    propertySubType: {
      type: String,
      required: [true, "Property Sub type is required"], //Commercial, Resedentional,Agricultural
    },
    propertyIntent: {
      type: String,
      enum: ["sell", "rent"],
      default: "sell",
    },
    info: {
      price: { type: String, required: [true, "Price is required"] },
      coords: { lng: { type: Number }, ltd: { type: Number } },
      block: { type: String },
      sector: { type: String },
      features: [{ type: String }],
      utilities: [{ type: String }],
      size: { type: String, required: [true, "Property Size is required"] },
      unit: { type: String, required: [true, "Unit is required"] }, //Marla Kanal
    },
    city: { type: Number, ref: "Cities", field: "key" },
    location: { type: Number, ref: "locations" },
    deleteFlag: { type: Boolean, default: false },
    featuredInfo: {
      isFeatured: { type: Boolean, default: false },
      requested: { type: Boolean, default: false },
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "flagged"],
    },
  },
  { timestamps: true }
);

const Ad = model("Ad", adSchema);
export default Ad;
