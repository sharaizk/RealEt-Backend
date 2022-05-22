import { Agent, Consumer, User, Builder, Ad } from "../../models";
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
 * Send Record of users based on Role (Consumer, Agent, Builder)
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await Agent.find();
    res.status(200).json({ data: users }).populate({ path: userId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    const activeAgents = await Agent.countDocuments({ status: "Verified" });
    const pendingAgents = await Agent.countDocuments({ status: "Pending" });
    const activeBuilders = await Builder.countDocuments({ status: "Verified" });
    const pendingBuilders = await Builder.countDocuments({ status: "Pending" });
    res.status(200).json({
      consumers,
      activeAgents,
      pendingAgents,
      activeBuilders,
      pendingBuilders,
    });
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
    const { role, status, message } = req?.body;
    console.log(req.params.userId);
    let adCredit = 3;
    let userAds = await Consumer.findOne({
      userId: req.params.userId,
    });
    console.log(userAds);
    //Checkin if user have any ads as consumer before role update
    if (userAds) {
      await roles[role].findOneAndUpdate(
        { userId: req.params.userId },
        {
          ads: userAds?.ads,
          status,
        }
      );
    }
    adCredit = role === "Agent" && status === "verified" ? 10 : 0;
    await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        secondaryRole: status === "verified" ? role : null,
        $inc: { adCredit },
        message: message,
      },
      { upsert: true, new: true }
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
export const getAllAds = async (req, res) => {
  try {
    let ads = await Ad.find(req.body.query).populate({
      path: "userId",
      sselect: "-otp -email -password -createdAt -updatedAt -__v",
    });
    return res.status(200).json({ data: ads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Approve Pending Ads
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const changeAdStatus = async (req, res) => {
  try {
    const { status, message } = req?.body;
    console.log(message);
    await Ad.findByIdAndUpdate(
      req.params.id,
      {
        status,
        message,
      },
      { upsert: true }
    );
    return res.status(200).json({ message: `Ad ${req.body.status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    return res.status(200).json({
      data: await Agent.find(req.body.query).populate({
        path: "userId",
        select: "-otp -email -password -createdAt -updatedAt -__v",
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBuilders = async (req, res) => {
  try {
    return res.status(200).json({
      data: await Builder.find(req.body.query).populate({
        path: "userId",
        select: "-otp -email -password -createdAt -updatedAt -__v",
      }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
