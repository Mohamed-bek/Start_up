import { Router } from "express";
import {
  updateUserAvatar,
  updateUserInfo,
  getUsers,
  getAdminInfoPurchases,
} from "../controllers/userController";

const userRouter = Router();

userRouter.put("/user_information", updateUserInfo);
userRouter.put("/user_avatar", updateUserAvatar);
userRouter.get("/users", getUsers);
userRouter.get("/admin-purchases", getAdminInfoPurchases);

export default userRouter;
