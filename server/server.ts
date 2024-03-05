import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import plantRoute from "./routes/plantRoutes";
import authRouter from "./routes/authRoutes";
import articleRouter from "./routes/articleRoutes";
import { isAuthorized } from "./utilite/isAthorazed";

require("dotenv").config();

const server = express();

server.use(express.json({ limit: "50mb" }));
server.use(
  cors({
    origin: process.env.ORIGIN,
  })
);
server.use(cookieParser());

const connectionDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`).then(() => {
      server.listen(process.env.PORT, () => console.log(`${process.env.PORT}`));
      console.log("Connected to Mongo");
    });
  } catch (err) {
    console.log(err);
    setTimeout(() => connectionDB(), 5000);
  }
};

connectionDB();
server.use(authRouter);
server.use(isAuthorized);
server.use(plantRoute);
server.use(articleRouter);
