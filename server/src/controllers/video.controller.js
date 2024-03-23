import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    // Construct the initial aggregation pipeline
    let pipeline = [];

    // Match stage to filter based on userId, if provided
    if (userId) {
        pipeline.push({ $match: { isPublished: true } });
    }

    // Add more stages as per your requirements

    // Example: Pagination using skip and limit
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Example: Sorting
    if (sortBy) {
        const sortField = `$${sortBy}`;
        const sortOrder = sortType === "desc" ? -1 : 1;
        pipeline.push({ $sort: { [sortField]: sortOrder } });
    }

    // Execute the aggregation
    const videos = await Video.aggregate(pipeline);

    // Send response
    res.json(videos);
});

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    const userId = req.user?._id;

    if (
        [title, description, videoLocalPath, thumbnailLocalPath, userId].some(
            (field) => field === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    console.log("Duration :: ", video);

    if (!video && !thumbnail) {
        throw new ApiError(500, "Error while uploading video");
    }

    const result = await Video.create({
        videoFile: video?.url || "",
        thumbnail: thumbnail?.url || "",
        owner: userId,
        title: title,
        description: description,
        duration: video?.duration,
    });

    if (!result) {
        throw new ApiError(500, "Something went wrong while uploading video");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { videoDetails: result },
            "Video published successfully"
        )
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video id not found");
    }

    const video = await Video.findById(new mongoose.Types.ObjectId(videoId));

    if (!video) {
        throw new ApiError(400, "Video Not Found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { videoDetails: video },
            "Video found successfully"
        )
    );
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const thumbnailLocalPath = req.file?.path;

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    if (!title && !description && !thumbnailLocalPath) {
        throw new ApiError(400, "New Data is required");
    }

    let thumbnail;
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    }

    console.log("Video Id :: ", videoId);
    console.log("Title :: ", title);
    console.log("Description :: ", description);
    console.log("Thumbnail :: ", thumbnail?.url);

    const result = await Video.findByIdAndUpdate(
        new mongoose.Types.ObjectId(videoId),
        {
            $set: {
                title: title,
                description: description,
                thumbnail: thumbnail?.url || "",
            },
        },
        { new: true }
    );

    res.status(200).json(
        new ApiResponse(200, { result: result }, "Video updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video id not found");
    }

    const result = await Video.findByIdAndDelete(
        new mongoose.Types.ObjectId(videoId)
    );

    if (!result) {
        throw new ApiError(500, "Something went wrong while deleting video");
    }

    res.status(200).json(
        new ApiResponse(200, { result: result }, "Video deleted successfully")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    const video = await Video.findByIdAndUpdate(
        new mongoose.Types.ObjectId(videoId),
        [
            {
                $set: {
                    isPublished: { $not: "$isPublished" },
                },
            },
        ],
        { new: true }
    );

    if (!video) {
        throw new ApiError(400, "Video Not Found");
    }

    res.status(200).json(
        new ApiResponse(200, { videoDetails: video }, "Publish Status Updated")
    );
});

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
