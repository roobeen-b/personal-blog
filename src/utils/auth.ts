import basicAuth from "basic-auth";
import { NextFunction, Request, Response } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const user = basicAuth(req);
  if (!user || user.name !== "admin" || user.pass !== "admin") {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.status(401).send("Unauthorized");
    return;
  }
  next();
};
