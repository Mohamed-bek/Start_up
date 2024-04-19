import { Router } from "express";
import {
  Activation,
  login,
  SignUp,
  updateUserRole,
  refreshAccessToken,
} from "../controllers/authController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const authRouter = Router();

authRouter.post("/signup", SignUp);
authRouter.post("/active", Activation);
authRouter.post("/login", login);
authRouter.put(
  "/update_role/:id",
  isAuthorizedRole(ERole.ADMIN),
  updateUserRole
);
authRouter.put("/refresh_token", refreshAccessToken);

export default authRouter;
