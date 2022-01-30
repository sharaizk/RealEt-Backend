/*
 * This File contains all validations functions regarding Auth,
 */

import { User } from "../models";

/*  @param filter : string
 *   @param value : string
 *   Finds single user and return his profile, if no user found, null is returned
 */
export const findUser = async (filter, value) =>
  User.findOne({ [filter]: value });

/*  @param filter : string
 *   @param value : string
 *   return Boolean
 *   Checks if a User exists on database or not
 */
export const userExists = async (filter, value) =>
  User.exists({ [filter]: value });
