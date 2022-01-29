import { compare } from "bcryptjs";
import { findUser } from "../../validators/auth.validator";

/*
 * @param req : Request
 * @param res: Response
 *  Login Function: This Function allows User to login To his respective Dashboard based on Role
 */
export const userLogin = async (req, res) => {
  try {
    const { type } = req?.params;
    const { password, email, phoneNumber } = req?.params;
    const user = await findUser({ [type]: email || phoneNumber });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Not exists, please Signup First" });
    }
    if (!(await compare(password, user?.password))) {
      res
        .status(401)
        .json({
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
