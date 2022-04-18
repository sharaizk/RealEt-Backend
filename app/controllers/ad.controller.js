import { Request, Response } from "express";
import fs from "fs";
import { promisify } from "util";
import { uploadPhoto } from "../libraries/multer";
import { Ad } from "../models";
import { ApiFeatures } from "../utils/ApiFeatures";
import roles from "../config/roles";

/**
 * This Function allows User to post a new ad
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const postAd = async (req, res) => {
  const unlinkFile = promisify(fs.unlink);
  try {
    const file = req?.files;
    const {
      title,
      description,
      type,
      propertySubType,
      propertyIntent,
      info,
      city,
      location,
    } = req?.body;
    let photos = [];
    const passedInfo = JSON.parse(info);
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
      propertyIntent,
      propertySubType,
      info: passedInfo,
      city,
      location,
    });
    ad.save();
    await roles[req.user.role].findOneAndUpdate(
      { userId: req.user._id },
      { $push: { ads: ad._id } },
      { new: true }
    );
    return res.status(202).json({
      message: "Ad Posted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * This Function allows User to get his Ads
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const myAds = async (req, res) => {
  try {
    const userId = req.user._id;
<<<<<<< HEAD
    const { count, status } = req.query;
    if (count) {
      const ListedAdsCount = await Ad.countDocuments({ userId });
      const NonListedAdsCount = await Ad.countDocuments({
        userId,
        status: { $ne: "approved" },
      });
      const UnApprovedCount = await Ad.countDocuments({
        userId,
        status: "unapproved",
      });
      return res.status(200).json({
        listed: ListedAdsCount,
        nonListed: NonListedAdsCount,
        unApproved: UnApprovedCount,
      });
    }
    const ads = await Ad.find({ userId, status: status });
    res.status(200).json({ data: ads, count: ads.length });
=======

    if (req?.query?.count === "true") {
      const ads = await Ad.countDocuments({
        userId,
        status: req?.query?.status,
      });
      res.status(200).json({ count: ads.length });
    } else {
      const ads = await Ad.find({ userId, status: req?.query?.status });
      res.status(200).json({ data: ads, count: ads.length });
    }
>>>>>>> 170a89a91bc07501a40e6715a4273515e7fa2210
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    const ad = await Ad.findOneAndUpdate(
      { $and: [{ userId: req.user._id, _id, deleteFlag: false }] },
      { deleteFlag: true },
      { new: true }
    );
    res.status(202).json({
      message: ad ? "Deleted" : "Ad not found",
      status: ad ? true : false,
    });
  } catch (error) {
    return res.status(500).json({
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
    const ad = await Ad.findOneAndUpdate(
      { $and: [{ userId: req.user._id, _id, deleteFlag: false }] },
      { "featuredInfo.request": true },
      { new: true }
    );
    res.status(202).json({
      message: ad
        ? `Dear ${req.user.fullName} your request for featuring ad has been submitted to admin`
        : "Ad not found",
      status: ad ? true : false,
    });
  } catch (error) {
    return res.status(500).json({
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
    const { city, location, propertySubType, propertyIntent } = req.query;
    console.log(propertySubType);

    // ====== || Created A class with ability to paginate or sort || ======
    let ads = await new ApiFeatures(
      Ad.find({
        city,
        location,
        propertyIntent,
        propertySubType,
        status: "approved",
      })
        .select("-createdAt -updatedAt -__v -featuredInfo -deleteFlag")
        .populate({
          path: "userId location_data city_data",
          select: "-otp -email -password -createdAt -updatedAt -__v",
        }),
      req.query
    )
      .sort()
      .pagination().query;

    const totalAdsFoundCount = await Ad.countDocuments({
      city,
      location,
      propertySubType,
      status: "approved",
    }).exec();
    return res.status(200).json({
      count: totalAdsFoundCount,
      data: ads,
    });
  } catch (error) {
    return res.status(500).json({
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
    let photos = [];

    if (req?.files) {
      const unlinkFile = promisify(fs.unlink);
      const file = req?.files;

      for (let i = 0; i < file.length; i++) {
        const result = await uploadPhoto(file[i]);
        photos.push(result.Location);
        await unlinkFile(file[i].path);
      }
    }
    const { id: _id } = req.params;
    const ad = await Ad.findOneAndUpdate(
      { $and: [{ userId: req.user._id, _id, deleteFlag: false }] },
      { ...req.body, $push: { photos } },
      { new: true }
    );
    res.status(ad ? 201 : 400).json({
      message: ad ? "Updated" : "Ad not found",
      ...({ ad } && { ad }),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleAd = async (req, res) => {
  try {
    const { id } = req.params;

    const singleListedProperty = await Ad.findOne({ _id: id })
      .populate({
        path: "userId",
        select: "fullName profileImage role _id email",
      })
      .populate("location_data city_data");

    return res.status(200).json({
      data: singleListedProperty,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
