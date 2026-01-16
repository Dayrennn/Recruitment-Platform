import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import positionRoutes from "./routes/position.routes";
import applicantsRoutes from "./routes/applicants.routes";

dotenv.config();

const app = express();
app.use(express.json());

//khusus register, login, me, logout
app.use("/api/auth", authRoutes);

// User management routes
app.use("/api/users", userRoutes);

// Management positions route
app.use("/api/positions", positionRoutes);

// Applicant
app.use("/api/applicants", applicantsRoutes);

// halaman utama
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Recruitment API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
