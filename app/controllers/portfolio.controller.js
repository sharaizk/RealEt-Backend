import { Request, Response } from "express";
import fs from "fs";
import { promisify } from "util";
import { uploadPhoto } from "../libraries/multer";
import { Portfolio } from "../models";
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
    const { title, description, type, propertySubType, info, city, location } =
      req?.body;
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
      info,
      city,
      location,
    });
    portfolio.save();

    await roles[req.user.role].findOneAndUpdate(
      { userId: req.user._id },
      { $push: { portfolio: portfolio._id } },
      { new: true }
    );
    return res.status(202).json({
      message: "Portfolio Added Successfully",
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

    const portfolio = await Portfolio.find({ userId });
    res.status(200).json({ count: portfolio.length, data: portfolio });
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
