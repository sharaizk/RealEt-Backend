/*
 * This File contains all validations functions regarding Auth,
 */

import validator from "validator";
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

/**
 * @param {string} str - string to check that it is valid phone number or not
 */
export const isPhoneNumber = (str) =>
  /^[\+]?[92]{2}?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{7}$/im.test(str);

/**
 * Returns the type of login: email or phone Number
 * @param {string} login
 */
export const getType = (login) =>
  (isPhoneNumber(login) && "phoneNumber") ||
  (validator.isEmail(login) && "email");
