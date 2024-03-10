import { Router } from "express";

import {
  commentArticle,
  createArticle,
  deleteArticle,
  getArticle,
  getArticleByFilter,
  getArticles,
  likeArticle,
  likeComment,
  likeReply,
  removeComment,
  replyComment,
  updateArticle,
} from "../controllers/articleController";
import { ERole } from "../models/userModel";
import { isAuthorizedRole } from "../utilite/isAthorazed";
const articleRouter = Router();

articleRouter.post(
  "/article",
  isAuthorizedRole(ERole.SPECIALIST),
  createArticle
);
articleRouter.delete(
  "/article/:id",
  isAuthorizedRole(ERole.SPECIALIST),
  deleteArticle
);
articleRouter.put(
  "/article/:id",
  isAuthorizedRole(ERole.SPECIALIST),
  updateArticle
);
articleRouter.get("/articles", getArticles);
articleRouter.get("/article/:id", getArticle);
articleRouter.get("/article_filter", getArticleByFilter);
articleRouter.put("/like_article/:id", likeArticle);
articleRouter.put("/comment_article/:id", commentArticle);
articleRouter.put("/like_comment/:id", likeComment);
articleRouter.put("/reply_comment/:id", replyComment);
articleRouter.put("/like_reply/:id", likeReply);
articleRouter.delete(
  "/comment_article/:id",
  isAuthorizedRole(ERole.SPECIALIST),
  removeComment
);

export default articleRouter;
