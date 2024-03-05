import mongoose, { Model, Schema, Document } from "mongoose";

export interface INotification extends Document {
  destination: string[];
  content: string;
}

const notificationSchema = new Schema<INotification>(
  {
    destination: [String],
    content: {
      required: [true, "content is required"],
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);
export default Notification;
