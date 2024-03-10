import { Router } from "express";
import { getNotifications } from "../controllers/notificationController";

const notificationRouter = Router();

notificationRouter.get("/notifications", getNotifications);
notificationRouter.get("/notification/:id", getNotifications);

export default notificationRouter;
