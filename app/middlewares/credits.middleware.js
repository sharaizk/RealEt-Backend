import { NextFunction, Request, Response } from "express";
import { User, Agent, Consumer, Builder } from "../models";

/**
 * Subtracts user ad credits
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */
export const subtractAdCredit = async (req, res, next) => {
  try {
    if (req.user.adCredit === 0) {
      return res.status(400).json({ message: "Ad Post Failed: 0 Ads Credit" });
    }
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { adCredit: req.user.adCredit - 1 },
      { new: true }
    );

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
