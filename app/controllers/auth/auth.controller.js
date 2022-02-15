import { NextFunction, Request, Response } from "express";
import isEmail from "validator/lib/isEmail";
import roles from "../../config/roles";
import { User } from "../../models";
import { findUser, userExists } from "../../validators/auth.validator";
import { randomOTP } from "../../utils/otp";
import { sendConfirmEmail } from "../../libraries/sendMail";
import sendVerificationCode from "../../libraries/sendMessage";
/**
 * This Function allows User to login To his respective Dashboard based on Role
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const userLogin = async (req, res) => {
  try {
    const { password, login } = req?.body;
    const type = isEmail(login, { domain_specific_validation: true })
      ? "email"
      : "phoneNumber";
    const user = await findUser({ [type]: login });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not exists, please Signup First" });
    }
    if (!(await user?.comparePassword(password))) {
      res.status(401).json({
        status: "Unauthorized",
        message: `${[type]}/Password does not match`,
      });
    }
    res.status(200).json({
      message: "Logged In",
      token: user.getJwtToken(),
      role: user.role,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Creates new instance of User in database
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */
export const userSignup = async (req, res, next) => {
  try {
    const { fullName, login, type, password, role = "Consumer" } = req?.body;
    if (await userExists(type, login)) {
      return res
        .status(400)
        .json({ message: `User already exists on this ${type}, please Login` });
    }
    const user = await User.create({
      fullName,
      [type]: login,
      password,
      role,
    });
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Creates new instance of Each respective role in database
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const roleSignup = async (req, res) => {
  try {
    const { role, _id } = req?.user;
    roles[role].create({ userId: _id });
    res.status(200).json({ message: "Signed Up" });
  } catch (error) {
    User.findOneAndDelete({ _id: req?.user?._id });
    res.status(400).json({ message: error.message });
  }
};

/**
 * Generates a OTP and sends to user for resetting password
 * @param {Request} req - request object
 * @param {Response} res - response object
 */

export const forgotPassword = async (req, res) => {
  try {
    const { loginType, login } = req.body;
    const OTP = await randomOTP();
    switch (loginType) {
      case "email":
        await sendConfirmEmail({
          email: login,
          subject: "Reset Password",
          text: `The OTP for your reset password is ${OTP}`,
        });
        break;
      case "phoneNumber":
        await sendVerificationCode(login, OTP);
        break;
      default:
        break;
    }
    await User.findOneAndUpdate({ [loginType]: login }, { $set: { otp: OTP } });
    res.status(200).json({
      message: `OTP successfully sent to ${login}`,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
