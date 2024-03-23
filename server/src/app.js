import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsConf from "./conf/cors.conf.js";

const app = express();

app.use(
    cors({
        origin: corsConf.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

export { app };
