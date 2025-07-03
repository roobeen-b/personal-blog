import ejs from "ejs";
import path from "path";
import express from "express";
import { TArticle } from "src/types/index";
import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises";

const app = express();
const PORT = 5173;
app.use(express.urlencoded({ extended: true }));

const FILE_PATH = path.join(__dirname, "/articles");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

const layoutPath = path.join(__dirname, "../views/layout.ejs");

async function renderWithLayout(
  page: string,
  articles: TArticle[] | TArticle = []
) {
  const content = await ejs.renderFile(
    path.join(__dirname, `../views/pages/${page}.ejs`),
    { articles },
    { async: true }
  );
  return ejs.renderFile(layoutPath, { body: content }, { async: true });
}

function createRenderRoute(view: string, extraData: TArticle[] = []) {
  return async (req: express.Request, res: express.Response) => {
    try {
      const html = await renderWithLayout(view, extraData);
      res.send(html);
    } catch (err) {
      console.error(err);
      res.status(500).send("Render error");
    }
  };
}

async function saveBlog({ title, description, createdAt, id }: TArticle) {
  try {
    const fileName = `${Date.now()}-blog.json`;
    const filePath = path.join(FILE_PATH, fileName);
    await mkdir(FILE_PATH, { recursive: true });

    await writeFile(
      filePath,
      JSON.stringify({ id, title, description, createdAt }, null, 2)
    );
  } catch (error) {
    console.error("Error saving file:", error);
  }
}

async function readAllFiles(directoryPath: string) {
  try {
    const files = await readdir(directoryPath);
    const fileContents: TArticle[] = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await stat(filePath);

      if (stats.isFile()) {
        const data = await readFile(filePath, { encoding: "utf8" });
        fileContents.push(JSON.parse(data));
      }
    }
    return fileContents;
  } catch (err) {
    console.error("Error reading directory or files:", err);
    throw err;
  }
}

app.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const articles = (await readAllFiles(FILE_PATH)).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const html = await renderWithLayout("index", articles);
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Render error");
  }
});
app.get("/add", createRenderRoute("add"));

app.post("/submit-form", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newArticle: TArticle = {
      id: Date.now(),
      title,
      description,
      createdAt: new Date().toDateString(),
    };
    await saveBlog(newArticle);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Render error");
  }
});

app.get("/article/:id", async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(404).send("Article not found");
    }
    const article = (await readAllFiles(FILE_PATH)).find(
      (article) => article.id === Number(id)
    );
    if (article) {
      const html = await renderWithLayout("article", article);
      res.send(html);
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Render error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
