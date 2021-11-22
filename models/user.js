import mongoose from "mongoose";
import jwt from "jsonwebtoken";

let userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: Number,
    unique: true,
  },
  userImage: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWTSECRETKEY);
  return token;
};
let UserModel = new mongoose.model("User", userSchema);

export default UserModel;
