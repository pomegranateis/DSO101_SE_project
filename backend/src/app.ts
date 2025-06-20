import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import knex from "knex";
import cors from "cors";
import { errorHandler } from "./utils";
import { NotFoundError } from "./errors";
import { PRODUCTION, JWT_SECRET, REFRESH_JWT_SECRET } from "./constants";
import routes from "./routes";
import { databaseConfig } from "./config";
import HTTP_CODE from "./errors/httpCodes";

export const API_PREFIX = "/api";

console.log(`Running in ${PRODUCTION ? "PRODUCTION" : "DEVELOPMENT"} mode\n`);

const knexConnection = knex(databaseConfig);
knexConnection
  .raw(
    `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema='public';
  `
  )
  .then((data) => {
    console.log(data.rows);
    console.log("\nDatabase connection successful\n");
  })
  .catch((error) => {
    console.error("\nDatabase connection error");
    console.error(error);
  });

// Start express app
const app = express();

app.set("JWT_SECRET", JWT_SECRET);
app.set("REFRESH_JWT_SECRET", REFRESH_JWT_SECRET);

app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(`${API_PREFIX}/public`, express.static("public"));
app.use(`${API_PREFIX}/uploads`, express.static("uploads"));
app.use(API_PREFIX, routes);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Backend is up and running!");
});

app.use(
  errorHandler((req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError("Endpoint not Found");
  })
);

interface ExpressError extends Error {
  status?: number;
  errors?: any;
  additionalInfo?: any;
}

app.use(
  (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const isUnexpectedError = err.status === undefined;
    console.log(err.message);
    console.log(err.stack);
    res.status(err.status || HTTP_CODE.INTERNAL_ERROR);
    res.json({
      message: isUnexpectedError && PRODUCTION ? "Internal error" : err.message,
      errors: err.errors,
      ...(err.additionalInfo || {}),
    });
  }
);

export default app;
