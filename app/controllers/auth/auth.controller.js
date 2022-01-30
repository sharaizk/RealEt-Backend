import { findUser, userExists } from "../../validators/auth.validator";
import isEmail from "validator/lib/isEmail";
import { Agent, Consumer, User } from "../../models";
import roles from "../../config/roles";
/*
 * @param req : Request
 * @param res: Response
 *  Login Function: This Function allows User to login To his respective Dashboard based on Role
 */
export const userLogin = async (req, res) => {
  try {
    const { password, login } = req?.body;
    const type = isEmail(login, { domain_specific_validation: true })
      ? "email"
      : "phoneNumber";
    const user = await findUser({ [type]: login });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not exists, please Signup First" });
    }
    if (!(await user?.comparePassword(password))) {
      res.status(401).json({
        status: "Unauthorized",
        message: `${[type]}/Password does not match`,
      });
    }
    res.status(200).json({
      message: "Logged In",
      token: user.getJwtToken(),
      role: user.role,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/*
 * @param req : Request
 * @param res : Response
 * @param next : Next
 * User Signup Function : Creates new instance of User in database
 */
export const userSignup = async (req, res, next) => {
  try {
    const { fullName, login, type, password } = req?.body;
    if (await userExists(type, login)) {
      return res
        .status(400)
        .json({ message: `User already exists on this ${type}, please Login` });
    }
    const user = await User.create({
      fullName,
      [type]: login,
      password,
    });
    req.user = user;
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  next();
};

/*
 * @param req : Request
 * @param res : Response
 * Signup Function : Creates new instance of Each respective role in database
 */
export const roleSignup = async (req, res) => {
  try {
    const { role, _id } = req?.user;
    roles[role].create({ userId: _id });
  } catch (error) {
    User.findOneAndDelete({ _id: req?.user?._id });
    res.status(400).json({ message: error.message });
  }
};
