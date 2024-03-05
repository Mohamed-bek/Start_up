import mongoose, { Model, Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  reciver: string;
  content: string;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      required: [true, "sender id is required"],
      type: "string",
    },
    reciver: {
      required: [true, "reciver id is required"],
      type: "string",
    },
    content: {
      required: [true, "content is required"],
      type: "string",
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = mongoose.model("Message", messageSchema);
export default Message;
