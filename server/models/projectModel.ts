import mongoose, { Model, Schema, Document } from "mongoose";

export interface IProject extends Document {
  adminId: string;
  name: string;
  desciption: string;
  budget: number;
  duration: {
    from: Date;
    to: Date;
  };
  reviews: { userId: string; review: string };
}

const projectSchema = new Schema<IProject>({
  adminId: {
    type: String,
    required: [true, "admin Id is required"],
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  desciption: {
    type: String,
    required: [true, "desciption is required"],
  },
  budget: Number,
  duration: {
    from: Date,
    to: Date,
  },
  reviews: [
    {
      userId: {
        type: String,
        required: [true, "userId is required"],
      },
      review: {
        type: String,
        required: [true, "review is required"],
      },
    },
  ],
});

const Project: Model<IProject> = mongoose.model("Organisme", projectSchema);
export default Project;
