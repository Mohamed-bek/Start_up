import { Response, Request, NextFunction } from "express";
import ErrorHandler from "../ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import redis from "./redis";

export const isAuthorized = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let access_token = req.headers.authorization;
    console.log(access_token);
    if (!access_token || access_token === "") {
      throw new Error(`Access Token expired`);
    }
    const { id } = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    const user = await redis.get(id);
    if (!user) {
      throw new Error("user not found");
    }
    (req as any).user = JSON.parse(user);
    next();
  } catch (err: any) {
    if (err.message === "Access Token expired") {
      ErrorHandler(err, 401, res);
    } else {
      ErrorHandler(err, 400, res);
    }
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
