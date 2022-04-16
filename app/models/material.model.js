import { model, Schema } from "mongoose";

const materialModel = new Schema(
  {
    materialType: { type: String },
    materialCompany: { type: String },
    firstClassPrice: { type: Number },
    secondClassPrice: { type: Number },
    thirdClassPrice: { type: Number },
  },
  { timestamps: true }
);

const material = model("Material", materialModel);
export default material;
