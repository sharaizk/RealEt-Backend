import { NextFunction, Request, Response } from "express";
<<<<<<< HEAD
import isEmail from "validator/lib/isemail";
import {
  isPhoneNumber,
  userExists,
  getType,
} from "../validators/auth.validator";
=======
import { getType, userExists } from "../validators/auth.validator";

>>>>>>> a11c37cd26bc5dbb1f1f7a98b7cbc030c47ea6f2
/**
 * Validates data sent from frontend
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */
export const validateAuth = async (req, res, next) => {
  try {
    const { login, password, fullName } = req.body;
    /**
     * Parsing End Point of the Request URL
     * @const
     * @type {string}
     */
    const URL = req.url.replaceAll("/", "");
    const errors = [];
    switch (URL) {
      case "signup":
        fullName || errors.push("Please Enter Your Full Name");
      case "login":
      case "signup":
        login || errors.push("Email/PhoneNumber Required");
        password || errors.push("Password Field is required");
        break;
      default:
        break;
    }
    errors.length > 0 ? res.status(400).json({ message: errors }) : next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Validates data sent from frontend
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */

export const validateLoginType = async (req, res, next) => {
  try {
    const { login = "" } = req.body;
    console.log(req.body);

    let type = null;
    type = getType(login);
    if (!type) {
      return res.status(300).json({ message: "Invalid PhoneNumber / Email" });
    }
    req.body.loginType = type;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Validates data sent from frontend
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */

export const findUser = async (req, res, next) => {
  const loginType = getType(req.body.login);
  const user = await userExists(loginType, req.body.login);
  if (!user)
    return res
      .status(400)
      .json({ message: `User Not found on this ${loginType}` });
  next();
};
