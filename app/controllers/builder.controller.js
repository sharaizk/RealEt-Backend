import { Request, Response } from "express";
import { Builder } from "../models";

/**
 * This Function allows to get all Builders
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
export const getBuilders = async (req, res) => {
  try {
    let builders = await Builder.find();
    return res.status(200).json({
      data: builders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getSingleBuilder = async (req, res) => {
  try {
    let builder = await Builder.find({ _id: req.params.id });
    return res.status(200).json({
      data: builder,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
