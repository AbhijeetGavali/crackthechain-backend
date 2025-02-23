import { Request, Response, NextFunction } from "express";

import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as morgan from "morgan";
import * as dotenv from "dotenv";
import * as cookieParser from "cookie-parser";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import logger from "./common/logger";
import errorMiddleware from "./middlewares/error.middleware";
import router from "./routes/router";
import { buildResponse } from "./common/utils";

dotenv.config();

morgan.token("host", function (req: express.Request, _res) {
  return req.hostname;
});

const app = express();

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1500, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  }),
);

app.use(cookieParser());

app.use(
  morgan(
    ":date[web] :method :host :url :status :res[content-length] - :response-time ms",
    {
      skip: function (req, _res) {
        return req.url === "/";
      },
    },
  ),
);

app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    res.status(403).send(buildResponse("", "invalid token", err));
  } else {
    next(err);
  }
});

const port = process.env.PORT ?? 8080;

app.use("/api/v1", router);

app.get("/", (_req, res) => {
  res.json({ msg: "Backend is up and running" });
});

app.use(errorMiddleware);
app.listen(port, async () => {
  logger.info("App Started on port", { port });
  try {
    await mongoose.connect(process.env.MONGO_URL ?? "");
    console.log("MONGO Database connection successful...");
  } catch (error) {
    logger.error(error);
  }
});
