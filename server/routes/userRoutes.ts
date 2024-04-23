import { Router } from "express";
import {
  updateUserAvatar,
  updateUserInfo,
  getUsers,
  getAdminInfoPurchases,
} from "../controllers/userController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const userRouter = Router();

userRouter.put("/user_information", updateUserInfo);
userRouter.put("/user_avatar", updateUserAvatar);
userRouter.get("/users", getUsers);
userRouter.get(
  "/admin-purchases",
  // isAuthorizedRole(ERole.ADMIN),
  getAdminInfoPurchases
);
export default userRouter;
