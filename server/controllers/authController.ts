import User, { IUser, ERole } from "../models/userModel";
import { Response, Request } from "express";
import ErrorHandler from "../ErrorHandler";
import bcrypt from "bcrypt";
import sendMail from "../utilite/sendMail";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { SendTokens } from "../utilite/sendToken";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  accessTokenOptions,
  createAccessToken,
  createRefreshToken,
  refreshTokenOptions,
} from "../utilite/sendToken";

const createToken = (user: IUser) => {
  const activation = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign({ user, activation }, `${process.env.TOKEN_SECRET}`, {
    expiresIn: "7d",
  });
  return { token, activation };
};

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { user }: { user: IUser } = req.body;
    const isExist = await User.findOne({ email: user.email });
    if (isExist) {
      throw new Error("Email already exists");
    }
    const { token, activation } = createToken(user);
    const template = fs.readFileSync(
      path.join(__dirname, "", "../mails/mail.ejs"),
      "utf8"
    );
    const html = ejs.render(template, {
      activationCode: activation,
      username: user.email,
    });
    const mailOptions = {
      html,
      email: user.email,
      from: "Platform",
      data: activation,
      subject: "Your activation code",
    };
    await sendMail(mailOptions);
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    });
    res.status(200).json({ token, activation });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const Activation = async (req: Request, res: Response) => {
  try {
    const activationCode = req.body.activationCode;
    let token = req.headers.authorization;
    if (!token) {
      token = req.cookies.jwt;
      if (!token) {
        throw new Error("Invalid Token , You have to Sign Up  again.");
      }
    }
    const { user, activation } = jwt.verify(
      token,
      `${process.env.TOKEN_SECRET}`
    ) as {
      user: IUser;
      activation: string;
    };
    const isExist = await User.findOne({ email: user.email });
    if (isExist) {
      throw new Error("Email already exists");
    }
    if (activationCode.toString() !== activation) {
      throw new Error("Invalid activation Code");
    }
    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    const newUser = await User.create(user);
    if (!newUser) {
      throw new Error("user is not created");
    }
    if (origin && origin.includes("localhost")) {
      res.cookie("jwt", "", {
        maxAge: 0,
        expires: new Date(Date.now() + 0),
      });
    } else {
      res.setHeader("jwt", "");
    }
    SendTokens(newUser, 200, res, req);
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error("Password is incorrect");
    }
    res.cookie("user", { hm: "mohamed" });
    SendTokens(user, 200, res, req);
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const role: ERole = req.body.role.toLowerCase();
    if (!Object.values(ERole).includes(role)) {
      throw new Error("This role is not defined");
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) {
      throw new Error("Canot update user role");
    }
    SendTokens(user, 200, res, req);
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    let refresh_token = req.headers.authorization;
    if (!refresh_token || refresh_token === "") {
      throw new Error(`Refresh Token expired you must login again`);
    }
    const { id } = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;
    if (!id) {
      throw new Error("Please the Id is deadlin");
    }
    const AccessToken = createAccessToken(id);
    const RefreshToken = createRefreshToken(id);
    res.cookie("access_token", AccessToken, accessTokenOptions);
    res.cookie("refresh_token", RefreshToken, refreshTokenOptions);
    res.status(200).json({
      success: true,
      refresh_token: RefreshToken,
      access_token: AccessToken,
    });
  } catch (err) {
    ErrorHandler("you have to login", 400, res);
  }
};
