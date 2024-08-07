import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      requered: true,
      unique: true,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

categorySchema.virtual("subcategory", {
  localField: "_id",
  foreignField: "categoryId",
  ref: "Subcategory",
});

const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;
