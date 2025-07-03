import { Router } from "express";
import {
  getHome,
  getAddForm,
  submitForm,
  getArticleById,
} from "../controllers/articleController";

const router = Router();

router.get("/", getHome);
router.get("/add", getAddForm);
router.post("/submit-form", submitForm);
router.get("/article/:id", getArticleById);

export default router;
