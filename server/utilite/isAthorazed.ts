import { Response, Request, NextFunction } from "express";
import ErrorHandler from "../ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import redis from "./redis";
import { IUser } from "../models/userModel";

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;
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
