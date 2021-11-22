import express from "express";
import bcrypt from "bcrypt";
import _ from "lodash";
import cloudinary from "cloudinary";

cloudinary.v2;

const router = express.Router();
import UserModel from "../../models/user.js";
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

//Get All Users
router.get("/", async (req, res) => {
  try {
    let users = await UserModel.find();
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

//Register User
router.post("/register", async (req, res) => {
  try {
    const file = req.files.photo;
    console.log(file);
    const imageURL = await cloudinary.uploader.upload(
      file.tempFilePath,
      (err, result) => {
        return result, err;
      }
    );
    let { name, phoneNumber, password, confirmPassword } = req.body;

    let user = await UserModel.findOne({ name });

    if (user) {
      return res.status(400).send("User Already Registered.");
    }

    if (!name || !password || !confirmPassword) {
      return res.send("All Feilds are Required");
    }

    if (password === confirmPassword) {
      const hashPassword = await bcrypt.hash(password, 10);

      let user = new UserModel();
      user.name = name;
      user.phoneNumber = phoneNumber;
      user.userImage = imageURL.url;
      user.password = hashPassword;
      user.confirmPassword = hashPassword;

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

//Login User
router.post("/login", async (req, res) => {
  try {
    let { name, phoneNumber, password } = req.body;
    let user = null;
    if (name) {
      user = await UserModel.findOne({ name });
    } else {
      user = await UserModel.findOne({ phoneNumber });
    }

    if (!user) {
      return res.status(400).send("Invalid Username/Phone Number or Password");
    }
    await bcrypt.compare(password, user.password, (err, valid) => {
      if (valid) {
        const token = user.generateAuthToken();

        return res.status(200).send(token);
      }
      if (!valid) {
        return res
          .status(400)
          .send("Invalid Username/Phone Number or Password");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
