import { AuthRequest } from "../middleware/auth.middleware";
import { Response } from "express";
import { prisma } from "../libs/prisma";

// create position
export const createPosition = async (req: AuthRequest, res: Response) => {
  try {
    const { title, location, type, description, salary } = req.body;
    const companyId = req.user.companyId;
    const createdById = req.user.id;

    if (!companyId || !createdById) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const position = await prisma.position.create({
      data: {
        title,
        location,
        type,
        description,
        salary,
        isActive: true,
        companyId,
        createdById,
      },
    });
    return res
      .status(201)
      .json({ message: "Position created successfully", position });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// list positions
export const listPositions = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user.companyId;
    if (!companyId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    const positions = await prisma.position.findMany({
      where: { companyId },
      select: {
        id: true,
        title: true,
        location: true,
        type: true,
        salary: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.json({ positions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get position detail
export const getPositionDetail = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId as string;
    const positionId = req.params.id as string;
    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const position = await prisma.position.findFirst({
      where: { id: positionId, companyId },
    });

    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }
    return res.json({ position });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update position
export const updatePosition = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user.companyId as string;
    const positionId = req.params.id as string;

    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updated = await prisma.position.updateMany({
      where: { id: positionId, companyId },
      data: req.body,
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Position not found" });
    }
    return res.json({ message: "Position updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// delete position
export const deletePosition = async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId as string;
    const positionId = req.params.id as string;

    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deleted = await prisma.position.deleteMany({
      where: { id: positionId, companyId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Position not found" });
    }
    return res.json({ message: "Position deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
