import { Router } from "express";
import {
  createPurchase,
  getPurchases,
  getClientPurchases,
  getSellerPurchaes,
  getAnalyticsPurchases,
} from "../controllers/purchaseController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const purchaseRouter = Router();

purchaseRouter.post("/purchase", createPurchase);
purchaseRouter.get("/purchases", getPurchases);
purchaseRouter.get("/purchase", getClientPurchases);
purchaseRouter.get("/analytics-purchase", getAnalyticsPurchases);
purchaseRouter.get(
  "/purchase_seller",
  isAuthorizedRole(ERole.SELLER),
  getSellerPurchaes
);

export default purchaseRouter;
