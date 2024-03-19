import { Response, Request, NextFunction } from "express";
import ErrorHandler from "../ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import redis from "./redis";
import {
  accessTokenOptions,
  createAccessToken,
  createRefreshToken,
  refreshTokenOptions,
} from "../utilite/sendToken";

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let refresh_token;
    const origin = req.headers.origin;
    if (origin && origin.includes("localhost")) {
      refresh_token = req.cookies.refresh_token;
    } else {
      refresh_token = req.headers["refresh_token"];
    }
    if (!refresh_token) {
      throw new Error("Access token not provided");
    }
    const { id } = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN as string
    ) as JwtPayload;
    if (!id) {
      throw new Error("Please the Id is deadline");
    }
    if (origin && origin.includes("localhost")) {
      res.cookie("access_token", createAccessToken(id), accessTokenOptions);
      res.cookie("refresh_token", createRefreshToken(id), refreshTokenOptions);
    } else {
      res.setHeader("refresh_token", createAccessToken(id));
      res.setHeader("access_token", createRefreshToken(id));
    }
    next();
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    const origin = req.headers.origin;
    if (origin && origin.includes("localhost")) {
      token = req.cookies.access_token;
    } else {
      token = req.headers["refresh_token"];
    }
    if (!token) {
      throw new Error(`Please Login to access this`);
    }
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN as string) as {
      id: any;
      type: string;
    };
    const user = await redis.get(id);
    if (!user) {
      throw new Error("user not found");
    }
    (req as any).user = JSON.parse(user);
    next();
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const isAuthorizedRole = (role: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (role != (req as any).user.role) {
        throw new Error("user not authorized to this role");
      }
      next();
    } catch (err) {
      ErrorHandler(err, 400, res);
    }
  };
};
