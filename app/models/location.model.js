import { model, Schema } from "mongoose";

const locationSchema = new Schema(
  {
    name: String,
    key: { type: Number, unique: true },
    city: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
locationSchema.virtual("city_data", {
  ref: "Cities",
  localField: "city",
  foreignField: "key",
  justOne: true,
});

const Location = model("Location", locationSchema, "locations");

export default Location;
