import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware";

const { CLIENT_URL } = process.env;

express.json({ limit: "50mb" });
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan("dev"));

if (CLIENT_URL) server.use(cors());

server.use("/", routes);

// Error catching endware.
server.use(errorHandler);

export default server;
