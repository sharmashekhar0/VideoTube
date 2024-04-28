import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const conf = {
    CORS_ORIGIN: String(process.env.CORS_ORIGIN),
};

export default conf;
