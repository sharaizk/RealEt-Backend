import { Request, Response } from "express";
import fs from "fs";
import { promisify } from "util";
import { uploadPhoto } from "../libraries/multer";
import { Portfolio } from "../models";
import {ApiFeatures} from "../utils/ApiFeatures";
import roles from "../config/roles";

/**
 * This Function allows Builder to post his portfolio
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const addPortfolio = async (req, res) => {
  try {
    const unlinkFile = promisify(fs.unlink);
    const file = req?.files;
    const {
      title,
      description,
      type,
      propertySubType,
      yearBuilt,
      size,
      city,
      location,
    } = req?.body;
    let photos = [];
    for (let i = 0; i < file.length; i++) {
      const result = await uploadPhoto(file[i]);
      photos.push(result.Location);
      await unlinkFile(file[i].path);
    }
    const portfolio = await Portfolio.create({
      userId: req.user._id,
      title,
      photos,
      description,
      type,
      propertySubType,
      yearBuilt,
      size,
      city,
      location,
    });
    portfolio.save();

    await roles[req.user.role].findOneAndUpdate(
      { userId: req.user._id },
      { $push: { portfolio: portfolio._id } },
      { new: true }
    );
    const allPortfolios = await Portfolio.find({ userId: req.user._id }).populate({
      path: "userId location_data city_data",
    }).sort("-createdAt");
    const totalPortfolios = await Portfolio.countDocuments({
      userId: req.user._id,
    })
    return res.status(202).json({
      message: "Portfolio Added Successfully",
      data:allPortfolios,
      count:totalPortfolios,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * This Function allows Builder to get his Portfolio
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const myPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    const portfolio = await new ApiFeatures(
      Portfolio.find({ userId }).populate({
        path: "userId location_data city_data",
      }).sort("-createdAt"),
      req.query
    ).pagination().query;
    const totalPortfolios = await Portfolio.countDocuments({ userId })
    res.status(200).json({ count: totalPortfolios, data: portfolio });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * This Function allows Builder to remove his Portfolio
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const removePortfolio = async (req, res) => {
  try {
    const _id = req.params.id;
    const portfolio = await Portfolio.findOneAndUpdate(
      { $and: [{ userId: req.user._id, _id, deleteFlag: false }] },
      { deleteFlag: true },
      { new: true }
    );
    res.status(202).json({
      message: portfolio ? "Deleted" : "Portfolio not found",
      status: portfolio ? true : false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * This Function allows Builder to Edit Portfolio
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const editPortfolio = async (req, res) => {
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
    const portfolio = await Portfolio.findOneAndUpdate(
      { $and: [{ userId: req.user._id, _id, deleteFlag: false }] },
      { ...req.body, $push: { photos } },
      { new: true }
    );
    res.status(portfolio ? 201 : 400).json({
      message: portfolio ? "Updated" : "Portfolio not found",
      ...({ portfolio } && { portfolio }),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * This Function allows Builder Get All Portfolio
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getAllPortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.find({ deleteFlag: false }).select(
      "-userId"
    );
    return res.status(200).json({
      count: portfolio.length,
      data: portfolio,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * This Function allows to Get All Builders
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getAllPortfolioOfSingleBuilder = async (req, res) => {
  try {
    let portfolio = await Portfolio.find({ deleteFlag: false })
      .find({
        userId: req.params.id,
      })
      .select("-userId");

    return res.status(200).json({
      count: portfolio.length,
      data: portfolio,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
