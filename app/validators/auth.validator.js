/*
 * This File contains all validations functions regarding Auth,
 */

import { User } from "../models";

export const findUser = async (filter, value) =>
  User.findOne({ [filter]: value });
