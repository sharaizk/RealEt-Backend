import { Request, Response } from "express";
import { Builder } from "../models";
import { uploadPhoto } from "../libraries/multer";
import fs from "fs";
import { promisify } from "util";

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
export const getSingleBuilder = async (req, res) => {
  try {
    let builder = await Builder.find({ _id: req.params.id });
    return res.status(200).json({
      data: builder,
    });
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
    const { officeName, officeCoordinates, officeContact } = req?.body;

    const logo = req?.file;
    const result = await uploadPhoto(logo);
    await unlinkFile(logo.path);

    await Builder.create({
      userId: req.user._id,
      officeName,
      officeContact,
      logo: result.Location,
    });
    return res.status(200).json({
      message:
        "We have received your application for verification. Verification process takes 24 to 48 hours",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
