import { Response, Request } from "express";
import User, { IUser } from "../models/userModel";
import { IArticle, IReplie } from "../models/articleModel";
import ErrorHandler from "../ErrorHandler";
import Plant from "../models/plantModel";
import Article from "../models/articleModel";
import redis from "../utilite/redis";
import mongoose from "mongoose";
import Problem from "../models/problemModel";
import Project from "../models/projectModel";
require("dotenv").config();

export const buyPlant = async (req: Request, res: Response) => {
  try {
    const quantity = req.body.quantity;
    const plantId = req.params.id;
    const plant = await Plant.findById(plantId);
    if (!plant) {
      throw new Error("Plant does not exist");
    }
    if (plant.quantity < quantity) {
      throw new Error("We dont have this quantity of this plant");
    }
    plant.quantity = plant.quantity - quantity;
    await plant.save();
    res.status(200).json({ success: true, plant });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const declareProblem = async (req: Request, res: Response) => {
  try {
    const { problem, location } = req.body;
    const newProblem = await Problem.create({
      problem,
      location,
      userId: (req as any).user._id,
    });
    if (!newProblem) {
      throw new Error("Problem does not created");
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const announceProject = async (req: Request, res: Response) => {
  try {
    const { name, desciption, duration, budget } = req.body;
    const project = await Project.create({
      adminId: (req as any).user._id,
      name,
      desciption,
      duration,
      budget,
    });
    if (!project) {
      throw new Error("We have Problem ,  the Project does not created");
    }
    res.status(200).json({ success: true, project });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProblems = async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit;
    const problems = await Problem.find()
      .limit(limit)
      .skip((parseInt(req.params.id) - 1) * parseInt(limit));
    res.status(200).json({ success: true, problems });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProblem = async (req: Request, res: Response) => {
  try {
    const problem = await Problem.findById(req.params.id);
    res.status(200).json({ success: true, problem });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const limit = req.body.limit;
    const projects = await Project.find()
      .limit(limit)
      .skip((parseInt(req.params.id) - 1) * parseInt(limit));
    res.status(200).json({ success: true, projects });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    res.status(200).json({ success: true, project });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getProjectByFilter = async (req: Request, res: Response) => {
  try {
    const filter = req.body;
    const projects = await Project.find(filter);
    res.status(200).json({ success: true, projects });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};
