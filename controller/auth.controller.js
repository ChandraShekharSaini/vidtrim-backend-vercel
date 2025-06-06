import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import bcrypt from "bcrypt";
import errorHandler from "../utilits/errorHandler.js";
import {
  generateRandomName,
  generateRandomPassword,
} from "../utilits/functionalHandler.js";
import SignupMailer from "../Nodemailer/SignupMailer.js";

export const postSignIn = async (req, res, next) => {
  console.log("Signin Start...");

  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(400, "User not found"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(password);
    if (!isPasswordCorrect) {
      return next(errorHandler(401, "Wrong Credentials"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    const { password: pass, ...rest } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 5 * 60 * 60 * 1000,
        path: "/",
        sameSite: "None",
        secure:true
      })
      .status(200)
      .json({
        message: "User Logged In Successfully!",
        user: rest,
      });
  } catch (error) {
    next(error);
  }
};

export const postSignUp = async (req, res, next) => {
  console.log("Signup start....");
  console.log(req.body);
  try {
    const { firstName, lastName, email } = req.body;

    const user = await User.findOne({ email });

    console.log("user",user);

    if (user) {
      return next(errorHandler(400, "User Already Exists"));
    }

    const generatedUsername = generateRandomName();
    const generatedPassword = generateRandomPassword();

    const hashPassword = await bcrypt.hash(generatedPassword, 10);
    console.log(typeof hashPassword);
    const newUser = new User({
      firstName,
      lastName,
      email,
      username: generatedUsername,
      password: hashPassword,
    });

    await newUser.save();

 await SignupMailer(email, generatedUsername, generatedPassword);
    res.status(201).json({
      message: "User Created Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const getSignOut = (req, res, next) => {
  console.log("logout");
  console.log(req.user.id);
  console.log(req.params.id);

  if (req.user.id === req.params.id) {
    try {
      const { id } = req.params;

      res.clearCookie("access_token", { httpOnly: true });
      res.status(200).json({
        message: "User Logged Out Successfully!",
      });
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "Unauthorized User"));
  }
};

export const deleteUser = async (req, res, next) => {
  console.log("----------User Delete Start---------");

  

  if (req.user.id === req.params.id) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete({ _id: id });
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "Unauthorized"));
  }
};

export const updateUser = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const { id } = req.params;
      const { firstName, lastName, username, email, password } = req.body;
      console.log(username);
      const hashPassword = await bcrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(
        { _id: id },
        { firstName, lastName, username, email, password: hashPassword },
        { new: true }
      );

      res.status(200).json({
        message: "User updated successfully",
        user: user,
      });
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "Unauthorized"));
  }
};
