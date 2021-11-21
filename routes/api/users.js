import express from "express";
import bcrypt from "bcrypt";
import _ from "lodash";

const router = express.Router();
import UserModel from "../../models/user.js";

//Register User
router.post("/register", async (req, res) => {
  try {
    let { name, phoneNumber, userImage, password, confirmPassword } = req.body;

    let user = await UserModel.findOne({ name });

    if (user) {
      return res.status(400).send("User Already Registered.");
    }

    if (!name || !password || !confirmPassword || !userImage) {
      return res.send("All Feilds are Required");
    }

    if (password === confirmPassword) {
      const hashPassword = await bcrypt.hash(password, 10);

      let user = new UserModel();
      user.name = name;
      user.password = hashPassword;
      user.confirmPassword = hashPassword;
      user.userImage = userImage;
      await user.save();

      const token = user.generateAuthToken();
      return res
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id", "name"]));
    } else {
      return res.status(400).send("Password Not Matached");
    }
  } catch (err) {
    console.log(err);
  }
});

export default router;
