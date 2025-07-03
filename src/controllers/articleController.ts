import { Request, Response } from "express";

import { TArticle } from "../types";
import { renderWithLayout } from "../utils/render";
import { readAllArticles, saveBlog } from "../utils/fileService";

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
