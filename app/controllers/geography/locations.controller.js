import { Location } from "../../models";

/**
 * Get All Locations of a city- with pagination
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const getLocations = async (req, res) => {
  try {
    const { sort = "key", city_id = 1 } = req.query;

    if (!city_id || isNaN(city_id)) {
      return res.status(400).json({ message: "Invalid City id" });
    }
    const locations = await Location.find({ city: city_id }).sort(sort);

    res.status(200).json({
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};

export const getAllLocations = (req, res) =>
  Location.find({})
    .populate("city_data")
    .then((locations) => res.status(200).json({ locations }));
