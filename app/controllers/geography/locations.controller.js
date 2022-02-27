import { Location } from "../../models";

/**
 * Get All Locations of a city- with pagination
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const getLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "key" } = req.query;
    const { city_id = 1 } = req.body?.query;

    if (!city_id || isNaN(city_id)) {
      return res.status(400).json({ message: "Invalid City id" });
    }
    const locations = await Location.find({ city: city_id })
      .limit(+limit * 1)
      .skip((+page - 1) * +limit)
      .sort(sort);

    res.status(200).json({
      count: locations.length,
      page,
      totalPages: Math.ceil((await Location.countDocuments()) / +limit),
      data: locations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};
