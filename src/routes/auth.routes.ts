import { Router } from "express";
import { register, login, me } from "../controllers/auth.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

//public routes
router.post("/register", register);
router.post("/login", login);

//authorized routes
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, (_req, res) => {
  // JWT logout biasanya di handle oleh client dengan menghapus tokennya
  res.json({ message: "Logout successful" });
});

export default router;
