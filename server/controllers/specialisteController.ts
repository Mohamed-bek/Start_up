import { Response, Request } from "express";
import User, { IUser } from "../models/userModel";
import { IArticle } from "../models/articleModel";
import ErrorHandler from "../ErrorHandler";
import Plant from "../models/plantModel";
import Article from "../models/articleModel";
import redis from "../utilite/redis";
require("dotenv").config();
