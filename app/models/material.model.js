import { model, Schema } from "mongoose";

const materialModel = new Schema(
  {
    materialType: { type: String },
    materialCompany: { type: String },
    firstClassPrice: { type: Number },
    secondClassPrice: { type: Number },
    thirdClassPrice: { type: Number },
    priceStandard: { type: String },
  },
  { timestamps: true }
);

const Material = model("Material", materialModel);
export default Material;
