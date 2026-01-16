import { Request, Response } from "express";
import prisma from "../libs/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth.middleware";

// register
export const register = async (req: Request, res: Response) => {
  try {
    const { companyName, email, password, fullName, phone } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const company = await prisma.company.create({
      data: {
        name: companyName,
        email,
        phone,
        address: "",
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: "ADMIN",
        companyId: company.id,
      },
    });

    return res.status(201).json({
      message: "Register success",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// login
export const login = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  cek password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// lihat info
export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        companyId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// create user
export const createUsers = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    //cek email sudah ada atau belum
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: role || "REKRUITER",
        companyId: req.user.companyId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// list user
export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res.status(400).json({ message: "companyId query is required" });
    }

    const users = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// lihat user detail
export const getUsersDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
        companyId: req.user.companyId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete user
export const deleteUsers = async (req, res) => {
  try {
    const userId = req.params.id;
    const companyId = req.user.companyId;

    // Menghapus user berdasarkan company yang sama
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.json({ message: "User Deleted", user });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
