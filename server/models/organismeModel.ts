import mongoose, { Model, Schema, Document } from "mongoose";

export interface IOrganisme extends Document {
  name: string;
  position: string;
  logo: {
    publicId: string;
    url: string;
  };
  folowers: string[];
  admins: string[];
}

const organismeSchema = new Schema<IOrganisme>({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  position: String,
  logo: {
    publicId: {
      type: String,
      required: [true, "public id is required"],
    },
    url: {
      type: String,
      required: [true, "url is required"],
    },
  },
  folowers: [String],
  admins: [String],
});

const Organisme: Model<IOrganisme> = mongoose.model(
  "Organisme",
  organismeSchema
);
export default Organisme;
