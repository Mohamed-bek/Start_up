import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import User, { IUser } from "../models/userModel";
import cloudinary from "cloudinary";
require("dotenv").config();

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, birthday, location, email } =
      req.body as IUser;
    const user = (await User.findById((req as any).user._id)) as IUser;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (birthday) user.birthday = birthday;
    if (location) user.location = location;
    if (email) user.email = email;
    console.log(email);
    await user.save().catch((err) => {
      throw new Error(err);
    });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body as IUser;
    if (!avatar) throw new Error("you must provide an avatar");
    const user = (await User.findById((req as any).user._id)) as IUser;
    if (user.avatar.public_id)
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    const myCloud = await cloudinary.v2.uploader.upload(avatar.toString(), {
      folder: "avatars",
      width: 150,
    });
    user.avatar.public_id = myCloud.public_id;
    user.avatar.url = myCloud.url;
    await user.save();
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
