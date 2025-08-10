import express from "express";
import cors from "cors";
import Session from "express-session";
import path from "path";
import { services } from "./services";
import { sequelize } from "./db";
import { querySchema } from "./schemas/querySchema";
import { validateMiddleware } from "./middlewares/validationMiddleware";
const sessionLib = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(sessionLib.Store);

export function createApp() {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
  const app = express();

  const sequelizeStore = new SequelizeStore({
    db: sequelize,
    expiration: 1000 * 60 * 60 * 24 * 30,
    checkExpirationInterval: 15 * 60 * 1000,
  });

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",").map((o) => o.trim());

  const sessionParser = Session({
    name: "lm-session",
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "$eCr3T",
    resave: false,
    store: sequelizeStore,
    cookie: {
      httpOnly: true,
      secure: process.env.IS_SECURE === "true",
      sameSite: process.env.IS_SECURE === "true" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  });

  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(sessionParser);
  app.use(
    cors({
      credentials: true,
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        return allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("Not allowed by CORS"));
      },
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "PATCH"],
    })
  );
  app.use(validateMiddleware(querySchema, "query"));

  app.use("/api", services);

  return app;
}