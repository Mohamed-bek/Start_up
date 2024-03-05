import Plant, { IPlant } from "../models/plantModel";
import { Response, Request, NextFunction } from "express";
import ErrorHandler from "../ErrorHandler";

export const addPlant = async (req: Request, res: Response) => {
  try {
    const { name, decription, price, images }: IPlant = req.body;
    const plant: IPlant = await Plant.create({
      name,
      decription,
      price,
      images,
      owner: (req as any).user._id,
    });
    res.status(200).json({ success: true, plant });
  } catch (e) {
    ErrorHandler(e, 400, res);
  }
};

export const getPlants = async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit;
    const plants = await Plant.find()
      .populate("owner", "firstName lastName avatar")
      .limit(limit)
      .skip((parseInt(req.params.id) - 1) * parseInt(limit));
    res.status(200).json({ success: true, plants });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPlant = async (req: Request, res: Response) => {
  try {
    const plant = await Plant.findById(req.params.id).populate(
      "owner",
      "firstName lastName"
    );
    res.status(200).json({ success: true, plant });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getPlantByFilter = async (req: Request, res: Response) => {
  try {
    const filter = req.body;
    const plants = await Plant.find(filter).populate(
      "owner",
      "firstName lastName"
    );
    res.status(200).json({ success: true, plants });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updatePlant = async (req: Request, res: Response) => {
  try {
    const newPlantInfo = req.body;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("This plant is not available ");
    }
    if (plant?.owner != (req as any).user._id) {
      throw new Error("This plant is not yours ,you can't update it ");
    }
    const newPlant = await Plant.findByIdAndUpdate(
      req.params.id,
      newPlantInfo,
      {
        new: true,
      }
    ).populate("owner", "firstName lastName");
    if (!newPlant) {
      throw new Error("We Have a Problem , the plant does not update");
    }
    res.status(200).json({ success: true, plant: newPlant });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const removeReviewPlant = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.body;
    const plant = await Plant.findById(req.params.id);
    const index = plant?.reviews.findIndex(
      (rev) => (rev as any)._id == reviewId
    ) as number;
    if (index != -1) {
      plant?.reviews.splice(index, 1);
      plant?.save();
    } else {
      throw new Error("The review is not available");
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const addReviewPlant = async (req: Request, res: Response) => {
  try {
    const { review } = req.body;
    const userId = (req as any).user._id;
    const plant = await Plant.findById(req.params.id).populate(
      "owner",
      "firstName lastName"
    );
    if (!plant) {
      throw new Error("id Plant does not exist");
    }
    const isPurschased = plant.purschased.find((id) => id == userId);
    if (!isPurschased) {
      throw new Error("You have to buy this Plant to add a review");
    }
    const isReviewBefore = plant.reviews.find(
      (rev) => (rev as any).userId == userId
    );
    console.log("i want here");
    if (isReviewBefore) {
      throw new Error("You have already review this plant");
    }
    plant.reviews.push({
      userId,
      review,
      likes: [],
    });
    await plant.save();
    res.status(200).json({ success: true, plant });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likePlant = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("id Plant does not exist");
    }
    const index = plant.likes.findIndex((id) => id == userId);
    if (index == -1) {
      plant.likes.push(userId);
    } else {
      plant.likes.splice(index, 1);
    }
    await plant.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const removePlant = async (req: Request, res: Response) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("This plant is not available ");
    }
    if (plant?.owner != (req as any).user._id) {
      throw new Error("This plant is not yours ,you can't update it ");
    }
    await Plant.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.body;
    console.log("reviewId : ", reviewId);
    const userId = (req as any).user._id;
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      throw new Error("id Plant does not exist");
    }
    const review = plant.reviews.find((rev) => (rev as any)._id == reviewId);
    if (!review) {
      throw new Error("this review is not available");
    }
    const index = review.likes.findIndex((id) => id == userId);
    console.log("index : ", index);
    if (index == -1) {
      review.likes.push(userId);
    } else {
      review.likes.splice(index, 1);
    }
    await plant.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
