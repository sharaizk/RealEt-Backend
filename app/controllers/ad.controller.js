import { Request, Response } from "express";
import fs, { stat } from "fs";
import { promisify } from "util";
import { uploadPhoto, uploadBase64 } from "../libraries/multer";
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
      virtualTour,
    } = req?.body;
    let photos = [];
    const passedInfo = JSON.parse(info);
    const parsedVirtualTour = JSON.parse(virtualTour);
    let finalVirtualTour = [];
    // Only if there are values in the virtualTour
    if (Object.keys(parsedVirtualTour).length != 0) {
      // Waiting for loop to finish
      await Promise.all(
        parsedVirtualTour.map(async (vTour, i) => {
          const sceneName = Object.keys(vTour)[0];
          const imageSource = await uploadBase64(
            sceneName,
            vTour[Object.keys(vTour)[0]].imageSource
          );
          const hotSpots = vTour[Object.keys(vTour)[0]]?.hotSpots;
          finalVirtualTour.push({
            sceneName,
            imageSource: imageSource.Location,
            hotSpots,
          });
        })
      );
    }
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
      virtualTour: finalVirtualTour,
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
    const { count, status, status2 = "" } = req.query;
    if (count === "true") {
      const ListedAdsCount = await Ad.countDocuments({
        userId,
        deleteFlag: false,
      });
      const NonListedAdsCount = await Ad.countDocuments({
        userId,
        status: { $ne: "approved" },
        deleteFlag: false,
      });
      const UnApprovedCount = await Ad.countDocuments({
        userId,
        status: "unapproved",
        deleteFlag: false,
      });
      return res.status(200).json({
        listed: ListedAdsCount,
        nonListed: NonListedAdsCount,
        unApproved: UnApprovedCount,
      });
    }
    const ads = await new ApiFeatures(
      Ad.find(
        { userId, status: { $in: [status, status2] }, deleteFlag: false },
        {
          title: 1,
          type: 1,
          propertyIntent: 1,
          location: 1,
          city: 1,
          status: 1,
        }
      ).populate({
        path: "location_data city_data",
      }),
      req.query
    ).pagination().query;
    const totalAds = await Ad.countDocuments({
      userId,
      status: { $in: [status, status2] },
      deleteFlag: false,
    }).exec();
    res.status(200).json({ data: ads, totalAds: totalAds });
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
