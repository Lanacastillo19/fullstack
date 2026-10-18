import { Router, type Response } from "express";
import { ItemModel } from "../models/Item";
import { authenticate, type AuthRequest } from "../middleware/auth";

export const itemRouter = Router();

// Protect all item routes
itemRouter.use(authenticate);

// 1. GET ALL (filtered by token user)
itemRouter.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await ItemModel.find({ reportedBy: req.userId });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2. GET ONE BY ID (filtered by token user)
itemRouter.get("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await ItemModel.findOne({ _id: req.params.id, reportedBy: req.userId });
    if (!item) {
      res.status(404).json({ success: false, message: "Item not found" });
      return;
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 3. CREATE (attached to token user)
itemRouter.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, location, category } = req.body;
    const newItem = await ItemModel.create({
      title,
      description,
      location,
      category: category || "General",
      reportedBy: req.userId,
    });
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create item" });
  }
});

// 4. UPDATE (filtered by token user)
itemRouter.put("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await ItemModel.findOneAndUpdate(
      { _id: req.params.id, reportedBy: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      res.status(404).json({ success: false, message: "Item not found or unauthorized" });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: "Update failed" });
  }
});

// 5. DELETE (filtered by token user)
itemRouter.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await ItemModel.findOneAndDelete({ _id: req.params.id, reportedBy: req.userId });
    if (!deleted) {
      res.status(404).json({ success: false, message: "Item not found or unauthorized" });
      return;
    }
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});