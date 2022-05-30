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
    const { officeName, officeCoordinates, officeContact, address } = req?.body;

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

    await Agent.create({
      userId: req.user._id,
      officeName,
      officeContact,
      logo: result.Location,
      cnic: cnicImages,
      address,
    });
    return res.status(200).json({
      message:
        "We have received your application for verification. Verification process takes 24 to 48 hours",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const agentProfile = async (req, res) => {
  try {
    const agent = Agent.findOne({ _id: req.user.id }).populate({
      path: "userId",
      select: "-password",
    });
    return res.status(200).json({ agent });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
