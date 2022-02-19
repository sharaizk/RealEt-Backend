import { NextFunction, Request, Response } from "express";
import { Ad } from "../models";
import { uploadPhoto, getURL } from "../libraries/multer";
import fs from "fs";
import { promisify } from "util";

const unlinkFile = promisify(fs.unlink);

/**
 * This Function allows User to post a new ad
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const postAd = async (req, res) => {
  try {
    const file = req.files;
    const { title, description, type, info } = req.body;
    let photos = [];
    for (let i = 0; i < file.length; i++) {
      const result = await uploadPhoto(file[i]);
      photos.push(result.Location);
      await unlinkFile(file[i].path);
    }
    const ad = await Ad.create({
      title,
      photos,
      description,
      type,
      info,
    });
    ad.save();
    return res.status(200).json({
      message: "Ad Posted Successfully",
    });
  } catch (error) {
    console.log("error");
    return res.status(404).json({ message: error.message });
  }
};
