import { Router } from "express";
import {
  updateUserAvatar,
  updateUserInfo,
} from "../controllers/userController";

const userRouter = Router();

userRouter.put("/user_information", updateUserInfo);
userRouter.put("/user_avatar", updateUserAvatar);

export default userRouter;
