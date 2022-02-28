import { Agent, Consumer, User } from "../../models";
import { Request, Response } from "express";
import { uploadPhoto } from "../../libraries/multer";
import { promisify } from "util";
import { unlink } from "fs";
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
