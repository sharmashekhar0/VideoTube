import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id is not found or invalid");
    }

    let isLiked;
    const isLikedAlready = await Like.findOne({
        video: new mongoose.Types.ObjectId(videoId),
        likedBy: req.user?._id,
    });

    if (isLikedAlready) {
        await Like.findByIdAndDelete(isLikedAlready._id);
        isLiked = true;
    } else {
        await Like.create({
            video: new mongoose.Types.ObjectId(videoId),
            likedBy: req.user?._id,
        });
        isLiked = false;
    }

    const message = isLiked
        ? "Video like removed successfully"
        : "Video like added successfully";

    res.status(200).json(new ApiResponse(200, { success: true }, message));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment id is not found or invalid");
    }

    let isLiked;
    const isLikedAlready = await Like.findOne({
        comment: new mongoose.Types.ObjectId(commentId),
        likedBy: req.user?._id,
    });

    if (isLikedAlready) {
        await Like.findByIdAndDelete(isLikedAlready._id);
        isLiked = false;
    } else {
        await Like.create({
            comment: new mongoose.Types.ObjectId(commentId),
            likedBy: req.user?._id,
        });
        isLiked = true;
    }

    const message = isLiked
        ? "Comment like added successfully"
        : "Comment like removed successfully";

    res.status(200).json(new ApiResponse(200, { success: true }, message));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId || !isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet id is not found or invalid");
    }

    let isLiked;
    const isLikedAlready = await Like.findOne({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: req.user?._id,
    });

    if (isLikedAlready) {
        await Like.findByIdAndDelete(isLikedAlready._id);
        isLiked = false;
    } else {
        await Like.create({
            tweet: new mongoose.Types.ObjectId(tweetId),
            likedBy: req.user?._id,
        });
        isLiked = true;
    }

    const message = isLiked
        ? "Tweet like added successfully"
        : "Tweet like removed successfully";

    res.status(200).json(new ApiResponse(200, { success: true }, message));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $exists: true },
            },
        },
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            { likedVideos: likedVideos },
            "Liked videos fetched successfully"
        )
    );
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
