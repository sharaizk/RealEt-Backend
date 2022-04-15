import { NextFunction, Request, Response } from "express";
/**
 * Validates User is consumer or agent
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {NextFunction} next - Next Function
 */

export const agentOrConsumer = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "Agent" && role !== "Consumer") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const builderOrConsumer = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "Builder" && role !== "Consumer") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isAdmin = (req, res, next) =>
  req.user.role === "Admin"
    ? next()
    : res.status(400).json({ message: "Not admin" });
