import { Agent, Consumer, User, Ad } from "../../models";
import { Request, Response } from "express";
import { uploadPhoto } from "../../libraries/multer";
import { promisify } from "util";
import { unlink } from "fs";
import roles from "../../config/roles";
/**
 * Updates Admin profile
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const updateAdmin = async (req, res) => {
  const unlinkFile = promisify(unlink);
  const image = req.file;
  try {
    if (image) {
      const result = await uploadPhoto(image);
      await unlinkFile(image?.path);
      req.body.profileImage = result.Location;
    }
    const user = await User.findOneAndUpdate(
      {
        $and: [{ _id: req.user._id, role: "Admin" }],
      },
      { ...req.body },
      { new: true }
    );
    await user.save();
    res.status(201).json({ message: "Updated Profile", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Send Record of users
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getAllUsers = async (req, res) => {
  try {
    res
      .status(200)
      .json({ data: await User.find(req.body.query).select("-password") });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Send Dashboard counts
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const dashboardCounts = async (req, res) => {
  try {
    const consumers = await Consumer.countDocuments();
    const activeAgents = await Agent.countDocuments({ status: true });
    const pendingAgents = await Agent.countDocuments({ status: false });
    res.status(200).json({ consumers, activeAgents, pendingAgents });
  } catch (error) {
    res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};
/**
 * User Role Update
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const roleUpdate = async (req, res) => {
  try {
    const { role, status } = req?.body;
    let adCredit = 3;
    let userAds = await Consumer.findOne({
      userId: req.params.userId,
    });
    await roles[role].findOneAndUpdate(
      { userId: req.params.userId },
      {
        ads: userAds.ads,
        status,
      }
    );
    adCredit = role === "Agent" ? 10 : 3;

    await User.findByIdAndUpdate(
      { _id: req.params.userId },
      { role, $inc: { adCredit } }
    );
    return res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Get All Pending Ads
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getPendingAds = async (req, res) => {
  try {
    let pendingAds = await Ad.find({ status: "Pending" })
      .select("-createdAt -updatedAt -__v")
      .populate({ path: "userId" });
    return res.status(200).json({ pendingAds: pendingAds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Approve Pending Ads
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const approveAd = async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    return res.status(200).json({ message: "Ad Approved" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Get All Pending Agents
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const pendingAgents = async (req, res) => {
  try {
    const pendingAgents = await Agent.find({ status: "Pending" }).populate({
      path: "userId",
    });
    return res.status(200).json({ data: pendingAgents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
