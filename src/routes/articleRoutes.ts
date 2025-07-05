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
router.get("/add", auth, getAddForm);
router.get("/admin", auth, adminHome);
router.post("/edit-form", auth, editArticle);
router.post("/submit-form", auth, submitForm);
router.post("/delete/:id", auth, deleteArticle);
router.get("/article/:id", getArticleById);
router.get("/edit/:id", auth, getEditArticleForm);

export default router;
