/*
 * This File contains all validations functions regarding Auth,
 */

import { User } from "../models";

/**
 *   Finds single user and return his profile, if no user found, null is returned
 *   @param {string} filter
 *   @param {string} value
 */
export const findUser = async (filter, value) =>
  User.findOne({ [filter]: value });

/**
 *   Checks if a User exists on database or not
 *   @param {string} filter
 *   @param {string} value
 *   @return Boolean
 */
export const userExists = async (filter, value) =>
  User.exists({ [filter]: value });
