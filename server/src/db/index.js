import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        if (connectionInstance) {
            console.log(
                "MongoDB Connection Established :: ",
                connectionInstance.connection.host
            );
        }
    } catch (error) {
        console.log("MongoDB Connection Failed :: ", error.message);
        process.exit(1);
    }
};

export default connectToDB;
