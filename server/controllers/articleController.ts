import { Response, Request } from "express";
import { IArticle, IReplie } from "../models/articleModel";
import ErrorHandler from "../ErrorHandler";
import Article from "../models/articleModel";
import redis from "../utilite/redis";
import mongoose from "mongoose";
require("dotenv").config();

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, image } = req.body;
    const article = await Article.create({
      title,
      content,
      creatorId: (req as any).user._id,
      image,
    });
    if (!article) {
      throw new Error("Article not created");
    }
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article?.creatorId != (req as any).user._id) {
      throw new Error("You cant delete this article , it's not yours");
    }
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const article = await Article.findById(req.params.id);
    if (article?.creatorId != (req as any).user._id) {
      throw new Error("You cant delete this article , it's not yours");
    }
    const newArticle = await Article.findByIdAndUpdate(req.params.id, {
      title,
      content,
    });
    res.status(200).json({ article: newArticle });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await Article.find().populate(
      "creatorId",
      "firstName lastName avatar"
    );
    res.status(200).json({ articles });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article = await Article.findById(req.params.id).populate(
      "creatorId",
      "firstName lastName avatar"
    );
    res.status(200).json({ article });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const getArticleByFilter = async (req: Request, res: Response) => {
  try {
    const filter = req.body;
    const articles = await Article.find(filter).populate(
      "creatorId",
      "firstName lastName avatar"
    );
    res.status(200).json({ articles });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeArticle = async (req: Request, res: Response) => {
  try {
    const id = (req as any).user._id;
    const article = (await Article.findById(req.params.id)) as IArticle;
    const index = article.likes.findIndex((l) => l == id);
    if (index === -1) {
      article.likes.push(id);
    } else {
      article.likes.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const commentArticle = async (req: Request, res: Response) => {
  try {
    const { comment } = req.body;
    const article = (await Article.findById(req.params.id)) as IArticle;
    article.comments.push({ userId: (req as any).user._id, comment } as any);
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    const index = comment?.likesId.findIndex((id) => id == user._id) as number;
    if (index === -1) {
      comment?.likesId.push(user._id);
    } else {
      comment?.likesId.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const replyComment = async (req: Request, res: Response) => {
  try {
    const { commentId, reply } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    if (!article) {
      throw new Error("Article does not exist");
    }
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    if (!comment) {
      throw new Error("Comment does not exist");
    }
    comment.replies.push({ userId: user._id, comment: reply } as IReplie);
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const likeReply = async (req: Request, res: Response) => {
  try {
    const { commentId, replyId } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    const comment = article.comments.find((c) => ((c as any)._id = commentId));
    const reply = comment?.replies.find((rep) => (rep as any)._id == replyId);
    if (!reply) {
      throw new Error("Reply does not exist");
    }
    const index = reply?.likesId.findIndex((id) => id == user._id) as number;
    if (index === -1) {
      reply?.likesId.push(user._id);
    } else {
      reply?.likesId.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};

export const removeComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const user = (req as any).user;
    if (!mongoose.isValidObjectId(commentId)) {
      throw new Error("Invalid comment ID");
    }
    const article = (await Article.findById(req.params.id)) as IArticle;
    const index = article.comments.findIndex(
      (c) => ((c as any)._id = commentId)
    );
    if (index == -1) {
      article.comments.push(user._id);
    } else {
      article.comments.splice(index, 1);
    }
    await article.save();
    res.status(200).json({ success: true });
  } catch (err) {
    ErrorHandler(err, 400, res);
  }
};