import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import conf from "../conf/cloudinary.conf.js";

cloudinary.config({
    cloud_name: conf.CLOUDINARY_CLOUD_NAME,
    api_key: conf.CLOUDINARY_API_KEY,
    api_secret: conf.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        console.log("Cloudinary Uploader :: ", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };