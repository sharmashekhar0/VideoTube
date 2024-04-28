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

    // Lookup stage to join with User collection and get the owner's username
    pipeline.push({
        $lookup: {
            from: "users", // Name of the User collection
            localField: "owner",
            foreignField: "_id",
            as: "ownerInfo",
        },
    });

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

    // Project stage to reshape the output
    pipeline.push({
        $project: {
            _id: 1,
            title: 1,
            description: 1,
            videoFile: 1,
            thumbnail: 1,
            duration: 1,
            views: 1,
            isPublished: 1,
            createdAt: 1,
            updatedAt: 1,
            username: { $arrayElemAt: ["$ownerInfo.username", 0] }, // Get the username from the ownerInfo array
            fullName: { $arrayElemAt: ["$ownerInfo.fullName", 0] },
            avatar: { $arrayElemAt: ["$ownerInfo.avatar", 0] },
        },
    });

    // Execute the aggregation
    const videos = await Video.aggregate(pipeline);

    // Send response
    res.status(200).json(
        new ApiResponse(
            200,
            { videoDetails: videos },
            "Videos fetched successfully"
        )
    );
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

    // Construct the aggregation pipeline
    const pipeline = [
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) },
        },
        {
            $lookup: {
                from: "users", // Name of the User collection
                localField: "owner",
                foreignField: "_id",
                as: "ownerInfo",
            },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                updatedAt: 1,
                username: { $arrayElemAt: ["$ownerInfo.username", 0] }, // Get the username from the ownerInfo array
            },
        },
    ];

    const video = await Video.aggregate(pipeline);

    if (!video || video.length === 0) {
        throw new ApiError(400, "Video Not Found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { videoDetails: video[0] },
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
