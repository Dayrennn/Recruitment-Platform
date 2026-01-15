import { Router } from "express";
import {
  createApplicant,
  listApplicant,
  getApplicantDetail,
  updateApplicantStatus,
  updateApplicantNotes,
  deleteApplicant,
} from "../controllers/applicants.controllers";

const router = Router();

router.post("/", createApplicant);
router.get("/", listApplicant);
router.get("/:id", getApplicantDetail);
router.patch("/:id/status", updateApplicantStatus);
router.patch("/:id/notes", updateApplicantNotes);
router.delete("/:id", deleteApplicant);

export default router;
