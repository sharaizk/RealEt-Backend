import { Request, Response } from "express";
import { Agent } from "../models";
import { uploadPhoto } from "../libraries/multer";
import fs from "fs";
import { promisify } from "util";

/**
 * This Function allows User become an Agent
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const becomeAnAgent = async (req, res) => {
  const unlinkFile = promisify(fs.unlink);

  try {
    const { officeName, officeCoordinates, officeContact } = req?.body;

    const logo = req?.file;
    const result = await uploadPhoto(logo);
    await unlinkFile(logo.path);

    await Agent.create({
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
