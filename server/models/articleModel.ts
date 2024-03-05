import mongoose, { Model, Schema, Document, ObjectId } from "mongoose";
import User from "./userModel";

export interface IReplie extends Document {
  userId: string;
  comment: string;
  likesId: string[];
}

export interface IArticle extends Document {
  likes: string[];
  comments: {
    userId: string;
    comment: string;
    likesId: string[];
    replies: IReplie[];
  }[];
  title: string;
  content: string;
  creatorId: ObjectId;
  image: {
    public_id: string;
    url: string;
  };
}

const replieSchema = new Schema<IReplie>({
  userId: mongoose.Types.ObjectId,
  comment: {
    type: String,
    required: [true, "comment is required"],
  },
  likesId: [mongoose.Types.ObjectId],
});

const articleSchema = new Schema<IArticle>({
  likes: [String],
  comments: [
    {
      userId: {
        required: [true, "User Id is required"],
        type: String,
      },
      comment: {
        required: [true, "Comment is required"],
        type: String,
      },
      likesId: [String],
      replies: [replieSchema],
    },
  ],
  title: {
    required: [true, "Title is required"],
    type: String,
  },
  content: String,
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, " The Creator of the article is required"],
  },
  image: {
    public_id: String,
    url: String,
  },
});

const Article: Model<IArticle> = mongoose.model("Article", articleSchema);
export default Article;
