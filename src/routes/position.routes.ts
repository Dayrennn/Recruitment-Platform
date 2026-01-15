import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createPosition,
  listPositions,
  getPositionDetail,
  updatePosition,
  deletePosition,
} from "../controllers/positions.controllers";

const router = Router();

// CRUD positions
router.post("/", authMiddleware, createPosition);
router.get("/", authMiddleware, listPositions);
router.get("/:id", authMiddleware, getPositionDetail);
router.put("/:id", authMiddleware, updatePosition);
router.delete("/:id", authMiddleware, deletePosition);

export default router;
