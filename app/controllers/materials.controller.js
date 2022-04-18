import { Material } from "../models";

export const addMaterial = async (req, res) => {
  try {
    const {
      materialType,
      materialCompany,
      firstClassPrice,
      secondClassPrice,
      thirdClassPrice,
      priceStandard,
    } = req.body;
    const material = await Material.create({
      materialType,
      materialCompany,
      firstClassPrice,
      secondClassPrice,
      thirdClassPrice,
      priceStandard,
    });
    res.status(201).json({ message: "Added", material });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Internal Server error : ${error.message}` });
  }
};
