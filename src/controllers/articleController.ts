import { Request, Response } from "express";

import { TArticle } from "../types";
import { renderWithLayout } from "../utils/render";
import {
  deleteBlog,
  editBlog,
  readAllArticles,
  saveBlog,
} from "../utils/fileService";

export const getHome = async (req: Request, res: Response) => {
  try {
    const articles = (await readAllArticles()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const html = await renderWithLayout("index", articles);
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Render error");
  }
};

export const getAdminHome = async (req: Request, res: Response) => {
  try {
    const articles = (await readAllArticles()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const html = await renderWithLayout("admin", articles);
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Render error");
  }
};

export const getAddForm = async (req: Request, res: Response) => {
  const html = await renderWithLayout("add");
  res.send(html);
};

export const submitForm = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const newArticle: TArticle = {
      id: Date.now(),
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveBlog(newArticle);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save article");
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const articles = await readAllArticles();
    const article = articles.find((a) => a.id === Number(id));

    if (article) {
      const html = await renderWithLayout("article", article);
      res.send(html);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading article");
  }
};

export const getEditArticleForm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) res.status(404).send("Article not found");

    const articles = await readAllArticles();
    const article = articles.find((a) => a.id === Number(id));
    if (article) {
      const html = await renderWithLayout("edit", article);
      res.send(html);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error editing article");
  }
};

export const editArticle = async (req: Request, res: Response) => {
  try {
    const { id, title, description } = req.body;

    if (!id) res.status(404).send("Article not found");

    const articles = await readAllArticles();
    const article = articles.find((a) => a.id === Number(id));
    if (article) {
      article.title = title;
      article.description = description;
      article.updatedAt = new Date().toISOString();
      await editBlog(article);
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to edit article");
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) res.status(404).send("Article not found");

    const articles = await readAllArticles();
    const article = articles.find((a) => a.id === Number(id));
    if (article) {
      await deleteBlog(article.id);
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to delete article");
  }
};
