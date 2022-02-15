import { Request, Response, NextFunction } from "express";
/**
 * Validates data sent from frontend
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */
export const validateAuth = async (req, res, next) => {
  try {
    const { login, password, type, fullName } = req.body;
    /**
     * Parsing End Point of the Request URL
     * @const
     * @type {string}
     */
    const URL = req.url.replaceAll("/", "");
    const errors = [];
    switch (URL) {
      case "signup":
        type || errors.push("Login Type not Defined");
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
