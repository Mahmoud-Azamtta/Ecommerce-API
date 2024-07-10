import mongoose, { Schema, Types, model } from "mongoose";

const subcategorySchema = new Schema(
  {
    name: {
      type: String,
      requered: true,
    },
    slug: {
      type: String,
      requered: true,
    },
    image: {
      type: Object,
      requered: true,
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive"],
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const subcategoryModel =
  mongoose.models.Subcategory || model("Subcategory", subcategorySchema);
export default subcategoryModel;
