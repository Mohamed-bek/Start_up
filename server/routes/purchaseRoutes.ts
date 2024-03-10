import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getClientPurchases,
  getSellerPurchaes,
} from "../controllers/purchaseController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const purchaseRouter = Router();

purchaseRouter.post("/purchase", createPurchase);
purchaseRouter.get("/purchases", isAuthorizedRole(ERole.ADMIN), getPurchases);
purchaseRouter.get("/purchase", getClientPurchases);
purchaseRouter.get(
  "/purchase_seller",
  isAuthorizedRole(ERole.SELLER),
  getSellerPurchaes
);

export default purchaseRouter;
