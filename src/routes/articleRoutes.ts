import { Router } from "express";
import {
  getHome,
  getAddForm,
  submitForm,
  editArticle,
  getArticleById,
  getEditArticleForm,
  getAdminHome,
  deleteArticle,
} from "../controllers/articleController";

const router = Router();

router.get("/", getHome);
router.get("/add", getAddForm);
router.get("/admin", getAdminHome);
router.post("/edit-form", editArticle);
router.post("/submit-form", submitForm);
router.get("/article/:id", getArticleById);
router.get("/edit/:id", getEditArticleForm);
router.post("/delete/:id", deleteArticle);

export default router;
