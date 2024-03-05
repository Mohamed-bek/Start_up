import mongoose, { Model, Schema, Document } from "mongoose";

export interface IProblem extends Document {
  userId: string;
  problem: string;
  location: string;
}

const problemSchema = new Schema<IProblem>(
  {
    userId: {
      required: [true, "user id is required"],
      type: "string",
    },
    problem: {
      required: [true, "problem is required"],
      type: "string",
    },
    location: String,
  },
  {
    timestamps: true,
  }
);

const Problem: Model<IProblem> = mongoose.model("Problem", problemSchema);
export default Problem;
