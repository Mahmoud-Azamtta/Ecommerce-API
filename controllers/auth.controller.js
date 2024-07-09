import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { customAlphabet } from "nanoid";
import AppError from "../utils/AppError.js";
import {
  verifyEmailTemplate,
  verificationCodeEmail,
} from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (user) {
    console.log(user);
    return next(
      new AppError("This email is already connected to an account", 409),
    );
  }

  const hashed = await bcrypt.hash(password, Number(process.env.SALT_ROUND));
  const token = jwt.sign({ email }, process.env.CONFIRM_EMAIL_SECRET);
  const confirmEmailUrl = `${process.env.HOST}/api/auth/confirm-email/${token}`;
  const htmlTemplate = verifyEmailTemplate(username, confirmEmailUrl);

  const newUser = await userModel.create({
    username,
    email,
    password: hashed,
  });

  if (!newUser) {
    return next(
      new AppError("An error occured while creating new user's profiel", 400),
    );
  }

  await sendEmail(email, "Confrim Your Email", htmlTemplate);

  return res.status(201).json({ message: "success", confirmToken: token });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("Invalid log in credentials", 404));
  }

  if (!user.isEmailConfirmed) {
    return next(new AppError("You have to confirm your email first", 400));
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return next(new AppError("Invalid log in credentials", 400));
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.LOGIN_SECRET,
    { expiresIn: 60 * 60 },
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, status: user.status },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: 60 * 60 * 4 },
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({ message: "success", accessToken });
};

export const confirmEmail = async (req, res, next) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.CONFIRM_EMAIL_SECRET);
  if (!decoded) {
    return next(new AppError("Provided token is invalid", 404));
  }

  await userModel.findOneAndUpdate(
    { email: decoded.email },
    { isEmailConfirmed: true },
  );

  return res.status(200).json({ message: "success" });
};

export const sendCode = async (req, res) => {
  const { email } = req.body;
  let code = customAlphabet("1234567890abcdzABCDZ", 4);
  code = code();
  await userModel.findOneAndUpdate(
    { email },
    { verificationCode: code },
    { new: true },
  );

  const html = verificationCodeEmail(code);

  await sendEmail(email, "Reset Password Code", html);
  // WARN: Code is not supposed to be here I included it in the response for testing purposes
  return res.status(200).json({ message: "success", code });
};

export const resetPassword = async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError(`not register account`, 400));
  }

  if (user.verificationCode != code) {
    return next(new AppError(`invalid code`, 400));
  }

  let match = await bcrypt.compare(password, user.password);
  if (match) {
    return next(new AppError(`same password`, 409));
  }

  user.password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUND));
  user.verificationCode = null;
  user.changePasswordTime = Date.now();
  await user.save();
  return res.status(200).json({ message: "success" });
};
