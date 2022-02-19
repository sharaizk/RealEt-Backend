import { Request, Response } from "express";
import fs from "fs";
import { promisify } from "util";
import { uploadPhoto } from "../libraries/multer";
import { Ad, User } from "../models";

/**
 * This Function allows User to post a new ad
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const postAd = async (req, res) => {
  const unlinkFile = promisify(fs.unlink);
  try {
    const file = req?.files;
    const { title, description, type, info } = req?.body;
    let photos = [];
    for (let i = 0; i < file.length; i++) {
      const result = await uploadPhoto(file[i]);
      photos.push(result.Location);
      await unlinkFile(file[i].path);
    }
    const ad = await Ad.create({
      userId: req.user._id,
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
<<<<<<< HEAD
    console.log("error");
    return res.status(500).json({ message: error.message });
=======
    return res.status(404).json({ message: error.message });
>>>>>>> 842f15d991730c6b4fd6fbb887a5c9e7ed0a887f
  }
};

/**
 * This Function allows User to get his Ads
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getAdByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const ad = await Ad.findById({ userId });
    console.log(ad);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

/**
 * This Function allows User remove his ad
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const removeAd = async (req, res) => {
  try {
    const _id = req.params.id;
    await Ad.findByIdAndUpdate(_id, { deleteFlag: true });
    return res.status(200).json({
      message: "Ad Deleted Successfully!",
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

/**
 * This Function allows User Feature His Property
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const featureProperty = async (req, res) => {
  try {
    const _id = req.params.id;
    await Ad.findByIdAndUpdate(_id, { featuredFlag: true });
    return res.status(200).json({
      message: "Ad Featured Successfully!",
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

/**
 * This Function allows User Get All Ads
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getAllAds = async (req, res) => {
  try {
    let ads = await Ad.find();
    return res.status(200).json({
      Ads: ads,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

/**
 * This Function allows User to Edit Ad
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const editAd = async (req, res) => {
  try {
    const _id = req.params.id;

    await Ad.findByIdAndUpdate(_id, req?.body);
    return res.status(200).json({
      message: "Ad Update Successfully!",
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};
