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
    if (role !== "agent" && role !== "consumer") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const builderOrConsumer = async (req, res, next) => {
  try {
    const { secondaryRole } = req.user;

    if (secondaryRole !== "builder" && role !== "builder") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isAdmin = (req, res, next) =>
  req.user.role === "admin"
    ? next()
    : res.status(400).json({ message: "Not admin" });
