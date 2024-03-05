import mongoose, { Model, Schema, Document } from "mongoose";

export enum ERole {
  USER = "user",
  SPECIALIST = "specialist",
  SELLER = "seller",
  FREELANCER = "freelancer",
}
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  birthday: Date;
  password: string;
  location: string;
  avatar: {
    publicId: string;
    url: string;
  };
  role: ERole;
  specialite?: string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "first Name is required "],
    },
    lastName: {
      type: String,
      required: [true, "last Name is required "],
    },
    email: {
      type: String,
      required: [true, "Email  is required "],
      unique: true,
    },
    avatar: {
      publicId: String,
      url: String,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      sparse: true,
    },
    birthday: Date,
    password: String,
    location: String,
    role: {
      type: String,
      enum: Object.values(ERole),
      default: ERole.USER,
    },
    specialite: String,
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model("User", userSchema);
export default User;
