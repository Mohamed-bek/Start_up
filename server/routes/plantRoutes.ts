import { Router } from "express";
import {
  addPlant,
  getPlant,
  getPlantByFilter,
  getPlants,
  likePlant,
  removeReviewPlant,
  updatePlant,
  removePlant,
  addReviewPlant,
  likeReview,
  changeQuantityPlant,
  changePriceOfPlant,
  getSellerPlants,
} from "../controllers/plantController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";

const plantRoute = Router();

plantRoute.get("/plants", getPlants);
plantRoute.get("/plant/:id", getPlant);
plantRoute.get("/plant_filter", getPlantByFilter);
plantRoute.post("/plant", isAuthorizedRole(ERole.SELLER), addPlant);
plantRoute.put("/plant/:id", isAuthorizedRole(ERole.SELLER), updatePlant);
plantRoute.delete("/plant/:id", isAuthorizedRole(ERole.SELLER), removePlant);
plantRoute.put("/like_plant/:id", likePlant);
plantRoute.put("/plant_review/:id", addReviewPlant);
plantRoute.delete(
  "/plant_review/:id",
  isAuthorizedRole(ERole.SELLER),
  removeReviewPlant
);
plantRoute.put("/like_review_plant/:id", likeReview);
plantRoute.put(
  "/quantity_plant/:id",
  isAuthorizedRole(ERole.SELLER),
  changeQuantityPlant
);
plantRoute.put(
  "/price_plant/:id",
  isAuthorizedRole(ERole.SELLER),
  changePriceOfPlant
);
plantRoute.get(
  "/seller_plants/",
  isAuthorizedRole(ERole.SELLER),
  getSellerPlants
);

export default plantRoute;
