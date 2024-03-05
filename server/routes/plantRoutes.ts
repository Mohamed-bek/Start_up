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
} from "../controllers/plantController";
import { isAuthorized } from "../utilite/isAthorazed";

const plantRoute = Router();

plantRoute.get("/plants", getPlants);
plantRoute.get("/plant/:id", getPlant);
plantRoute.get("/plant_filter", getPlantByFilter);
plantRoute.post("/plant", addPlant);
plantRoute.put("/plant/:id", updatePlant);
plantRoute.delete("/plant/:id", removePlant);
plantRoute.put("/like_plant/:id", likePlant);
plantRoute.put("/plant_review/:id", addReviewPlant);
plantRoute.delete("/plant_review/:id", removeReviewPlant);
plantRoute.put("/like_review_plant/:id", likeReview);

export default plantRoute;
