import { Request, Response } from "express";
import { ApplicantStatus, PrismaClient } from "@prisma/client";
import { prisma } from "../libs/prisma";

// create applicant
export const createApplicant = async (req: Request, res: Response) => {
  try {
    const {
      positionId,
      fullName,
      email,
      phone,
      education,
      experience,
      resumeUrl,
    } = req.body;

    if (!positionId || !fullName || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exp =
      experience !== undefined && experience !== null ? Number(experience) : 0;

    if (Number.isNaN(exp)) {
      return res.status(400).json({ message: "Invalid experience value" });
    }

    // validasi position
    const position = await prisma.position.findUnique({
      where: { id: positionId },
      select: { id: true },
    });

    if (!position) {
      return res.status(404).json({ message: "Position not found" });
    }

    const applicant = await prisma.applicant.create({
      data: {
        positionId,
        fullName,
        email,
        phone,
        education,
        experience: exp,
        resumeUrl,
      },
    });

    return res.status(201).json(applicant);
  } catch (error) {
    console.error("CREATE APPLICANT ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// list applicant
export const listApplicant = async (req: Request, res: Response) => {
  try {
    const { positionId } = req.query;

    const applicants = await prisma.applicant.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      message: "Success",
      data: applicants,
    });
  } catch (error) {
    console.error("LIST APPLICANT ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get applicant detail
export const getApplicantDetail = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: {
        position: {
          select: {
            id: true,
            title: true,
            companyId: true,
          },
        },
      },
    });

    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    return res.status(200).json(applicant);
  } catch (error) {
    console.error("GET APPLICANT ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//update applicant status
export const updateApplicantStatus = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(ApplicantStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const applicant = await prisma.applicant.update({
      where: { id },
      data: { status },
    });

    return res.status(200).json(applicant);
  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);
    return res.status(404).json({ message: "Applicant not found" });
  }
};

// update applicant note
export const updateApplicantNotes = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const applicant = await prisma.applicant.update({
      where: { id },
      data: { notes },
    });

    return res.status(200).json(applicant);
  } catch (error) {
    console.error("UPDATE NOTES ERROR:", error);
    return res.status(404).json({ message: "Applicant not found" });
  }
};

// delete applicant
export const deleteApplicant = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await prisma.applicant.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Deleted Success" });
  } catch (error) {
    console.error("DELETE APPLICANT ERROR:", error);
    return res.status(404).json({ message: "Applicant not found" });
  }
};
