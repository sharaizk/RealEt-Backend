import { Request, Response } from "express";
import { Builder } from "../models";
import { uploadPhoto } from "../libraries/multer";
import fs from "fs";
import { promisify } from "util";
import { ApiFeatures } from "../utils/ApiFeatures";

/**
 * This Function allows to get all Builders
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getBuilders = async (req, res) => {
  try {
    let builders = await Builder.find();
    return res.status(200).json({
      data: builders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const builderProfile = async (req, res) => {
  try {
    const builder = await Builder.findOne({ userId: req.user._id }).populate({
      path: "userId location_data city_data",
      select: "-password",
    });
    return res.status(200).json({ builder });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * This Function allows User become a builder
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const becomeABuilder = async (req, res) => {
  const unlinkFile = promisify(fs.unlink);

  try {
    const { officeName, city, location, officeContact } = req?.body;

    let cnicImages = [];
    const cnic = req?.files.cnic;
    for (let i = 0; i < cnic.length; i++) {
      const result = await uploadPhoto(cnic[i]);
      cnicImages.push(result.Location);
      await unlinkFile(cnic[i].path);
    }

    const logo = req?.files.logo[0];
    const result = await uploadPhoto(logo);
    await unlinkFile(logo.path);

    await Builder.create({
      userId: req.user._id,
      officeName,
      officeContact,
      logo: result.Location,
      cnic: cnicImages,
      city,
      location,
    });
    return res.status(200).json({
      message:
        "We have received your application for verification. Verification process takes 24 to 48 hours",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchBuilders = async (req, res) => {
  try {
    const { location, city } = req?.query;
    if (!location || !city) {
      return res.status(401).json({
        message: "Please fill the form",
      });
    }
    const searchedBuilders = await new ApiFeatures(
      Builder.find({ city: city, location: location }, { cnic: 0 }).populate({
        path: "location_data city_data",
      }),
      req.query
    ).pagination().query;

    const totalBuilders = await Builder.countDocuments({
      city: city,
      location: location,
    });

    return res.status(200).json({ searchedBuilders, totalBuilders });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
