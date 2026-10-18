import { Schema, model, models } from "mongoose";
import type { ItemDoc } from "../types/index";

const itemSchema = new Schema<ItemDoc>(
  {
    title: { 
      type: String, 
      required: [true, "Title is required"], 
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Description is required"], 
      trim: true 
    },
    location: { 
      type: String, 
      required: [true, "Location is required"], 
      trim: true 
    },
    category: {
      type: String,
      enum: ["General", "Electronics", "Personal Items", "Documents"],
      default: "General",
      required: true,
    },
    status: {
      type: String,
      enum: ["Unclaimed", "Claimed"],
      default: "Unclaimed",
    },
    reportedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
  },
  { timestamps: true }
);

itemSchema.set("toJSON", {
  transform(_doc: unknown, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ItemModel = models.Item || model<ItemDoc>("Item", itemSchema);