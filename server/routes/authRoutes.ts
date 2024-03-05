import { Router } from "express";
import {
  Activation,
  login,
  SignUp,
  updateUserRole,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", SignUp);
authRouter.post("/active", Activation);
authRouter.post("/login", login);
authRouter.put("/update_role/:id", updateUserRole);

export default authRouter;
