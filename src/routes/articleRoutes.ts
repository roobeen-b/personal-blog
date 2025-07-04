import { Router } from "express";
import {
  getHome,
  adminHome,
  getAddForm,
  submitForm,
  editArticle,
  deleteArticle,
  getArticleById,
  getEditArticleForm,
} from "../controllers/articleController";
import { auth } from "../utils/auth";

const router = Router();

router.get("/", getHome);
router.get("/add", getAddForm);
router.get("/admin", auth, adminHome);
router.post("/edit-form", editArticle);
router.post("/submit-form", submitForm);
router.post("/delete/:id", deleteArticle);
router.get("/article/:id", getArticleById);
router.get("/edit/:id", getEditArticleForm);

export default router;
