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
    const { role, status } = req?.body;
    console.log(req.params.userId);
    let adCredit = 3;
    let userAds = await Consumer.findOne({
      userId: req.params.userId,
    });
    console.log(userAds);
    if (userAds) {
      console.log("Inif");
      await roles[role].findOneAndUpdate(
        { userId: req.params.userId },
        {
          ads: userAds?.ads,
          status,
        }
      );
    }
    adCredit = role === "Agent" ? 10 : 3;

    const i = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { role, $inc: { adCredit } },
      { new: true }
    );
    console.log(i);
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
    let ads = await Ad.find(req.body.query).populate({ path: "userId" });
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
    await Ad.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    return res.status(200).json({ message: `Ad ${req.body.status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    return res.status(200).json({
      data: await Agent.find(req.body.query).populate({ path: "userId" }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getBuilders = async (req, res) => {
  try {
    return res.status(200).json({
      data: await Builder.find(req.body.query).populate({ path: "userId" }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};