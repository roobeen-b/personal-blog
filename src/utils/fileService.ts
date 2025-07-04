import path from "path";
import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises";

import { TArticle } from "../types";

const FILE_PATH = path.join(__dirname, "../../articles");

export const saveBlog = async (article: TArticle) => {
  const fileName = `${Date.now()}-blog.json`;
  const filePath = path.join(FILE_PATH, fileName);
  await mkdir(FILE_PATH, { recursive: true });
  await writeFile(filePath, JSON.stringify(article, null, 2));
};

export const editBlog = async (article: TArticle) => {
  const fileName = `${article.id}-blog.json`;
  const filePath = path.join(FILE_PATH, fileName);
  await mkdir(FILE_PATH, { recursive: true });
  await writeFile(filePath, JSON.stringify(article, null, 2));
};

export const readAllArticles = async (): Promise<TArticle[]> => {
  const files = await readdir(FILE_PATH);
  const articles: TArticle[] = [];

  for (const file of files) {
    const filePath = path.join(FILE_PATH, file);
    const stats = await stat(filePath);
    if (stats.isFile()) {
      const data = await readFile(filePath, "utf-8");
      articles.push(JSON.parse(data));
    }
  }

  return articles;
};
