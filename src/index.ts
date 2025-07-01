import ejs from "ejs";
import path from "path";
import express, { Request, Response } from "express";

const app = express();
const PORT = 5173;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

const layoutPath = path.join(__dirname, "../views/layout.ejs");

async function renderWithLayout(
  page: string,
  data: { title?: string; [key: string]: any } = {}
) {
  const { title = "Blog", ...rest } = data;
  const content = await ejs.renderFile(
    path.join(__dirname, `../views/pages/${page}.ejs`),
    data,
    { async: true }
  );

  return ejs.renderFile(
    layoutPath,
    { ...rest, title, body: content },
    { async: true }
  );
}

function createRenderRoute(
  view: string,
  extraData: Record<string, unknown> = {}
) {
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

app.get("/", createRenderRoute("index"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
