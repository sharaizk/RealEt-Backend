import { NextFunction, Request, Response } from "express";
import { User } from "../models";
import { verify } from "jsonwebtoken";
import config from "../config";

/**
 * Validates logged in User
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */

export const userAuth = async (req, res, next) => {
  try {
    const token =
      req.headers["x-access-token"] ||
      req?.headers?.authorization?.split(" ")[1];
    if (!token || token === "null") {
      return res
        .status(401)
        .json({ message: "Login first to access the resource." });
    }

    const decoded = verify(token, config.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Token expired, please generate new one" });
    }
    req.user = await User.findById(decoded.id);
  } catch (error) {
    return res.status(401).json({
      message: "There is a problem with your token, please login again",
      error: error.message,
    });
  }

  next();
};
