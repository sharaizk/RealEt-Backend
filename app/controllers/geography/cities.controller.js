import { Cities } from "../../models";

/**
 * This Function Returns list of cities
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const getAllcities = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "key" } = req?.query;
    const cities = await Cities.find(req.body.query).sort(sort);
    res.status(200).json({
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR : ${error.message}` });
  }
};
