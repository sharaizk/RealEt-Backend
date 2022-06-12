import { Schema, Types, model } from "mongoose";

const builderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User" },
    officeName: { type: String },

    logo: { type: String },
    portfolio: [Types.ObjectId],
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "verified", "rejected"],
    },
    officeContact: { type: String },
    cnic: [{ type: String }],
    city: { type: Number, ref: "Cities" },
    location: { type: Number, ref: "Location" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

builderSchema.virtual("city_data", {
  ref: "Cities",
  localField: "city",
  foreignField: "key",
  justOne: true,
});
builderSchema.virtual("location_data", {
  ref: "Location",
  localField: "location",
  foreignField: "key",
  justOne: true,
});

const Builder = model("Builder", builderSchema);
export default Builder;
