import { model, Schema } from "mongoose";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import config from "../config";

const userSchema = new Schema(
  {
    fullName: { type: String, required: [true, "Full Name is required"] },
    email: { type: String, lowercase: true },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "A password is required to signup"],
    },
    profileImage: { type: String },
    socialId: { type: String },
    role: {
      type: String,
      enum: ["consumer", "agent", "builder", "admin"],
      default: "consumer",
    },
    otp: {
      status: { type: String, default: null },
      code: { type: Number },
      mode: { type: String },
    },
    adCredit: { type: Number, default: 3 },
  },
  { timestamps: true, bufferTimeoutMS: 20000 }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await hash(this.password, 10);
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};
// Return JWT
userSchema.methods.getJwtToken = function () {
  return sign({ id: this._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE_TIME,
  });
};

const User = model("User", userSchema);

export default User;
