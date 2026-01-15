import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createUsers,
  listUsers,
  getUsersDetail,
  deleteUsers,
} from "../controllers/auth.controllers";

const router = Router();

// CRUD User
router.post("/", authMiddleware, createUsers);
router.get("/", authMiddleware, listUsers);
router.get("/:id", authMiddleware, getUsersDetail);
router.delete("/:id", authMiddleware, deleteUsers);

export default router;
