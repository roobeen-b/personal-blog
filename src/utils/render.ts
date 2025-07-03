import ejs from "ejs";
import path from "path";
import { TArticle } from "../types";
import { parseDate } from "./parseDate";

const layoutPath = path.join(__dirname, "../../views/layout.ejs");

export const renderWithLayout = async (
  page: string,
  data: TArticle[] | TArticle = []
) => {
  const pagePath = path.join(__dirname, `../../views/pages/${page}.ejs`);
  const content = await ejs.renderFile(
    pagePath,
    { articles: data, parseDate },
    { async: true }
  );
  return ejs.renderFile(layoutPath, { body: content }, { async: true });
};
