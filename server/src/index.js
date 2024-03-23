import dotenv from "dotenv";
import connectToDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT :: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed :: ", error);
    });
