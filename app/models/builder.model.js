import { Schema, Types, model } from "mongoose";

const builderSchema = new Schema(
  {
    officeName: { type: String },
    officeCoordinates: {
      longitude: { type: Number },
      latitude: { type: Number },
    },
    logo: { type: String },
    portfolio: [Types.ObjectId],
    status: { type: Boolean },
    officeContact: { type: String },
  },
  { toJSON: true, toObject: true, bufferTimeoutMS: 20000, timestamps: true }
);

const Builder = model("Builder", builderSchema);
export default Builder;
