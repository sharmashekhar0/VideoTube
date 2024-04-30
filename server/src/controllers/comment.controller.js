import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user",
            },
        },
        {
            $addFields: {
                user: { $arrayElemAt: ["$user", 0] }, // Flatten the 'user' array
            },
        },
        {
            $project: {
                _id: 1,
                content: 1,
                owner: 1,
                video: 1,
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                "user.avatar": 1,
                "user.username": 1,
                "user.fullName": 1,
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit),
        },
        {
            $limit: parseInt(limit),
        },
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            { comments: comments },
            "Comment on video fetched successfully"
        )
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user?._id;
    const { videoId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    if (!videoId) {
        throw new ApiError(400, "Video Id is required");
    }

    if (content?.trim() === "") {
        throw new ApiError(400, "Comment Content is required");
    }

    console.log("Content :: ", content);

    const comment = await Comment.create({
        content: content?.trim(),
        owner: userId,
        video: new mongoose.Types.ObjectId(videoId),
    });

    if (!comment) {
        throw new ApiError(400, "Something went wrong while adding comment");
    }

    res.status(200).json(new ApiResponse(200, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment id is required");
    }

    if (content?.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        new mongoose.Types.ObjectId(commentId),
        {
            $set: {
                content: content,
            },
        },
        { new: true }
    );

    if (!updatedComment) {
        throw new ApiError(500, "Something went wrong while updating comment");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { commentDetails: updatedComment },
            "Comment updated successfully"
        )
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment id is required");
    }

    const comment = await Comment.findByIdAndDelete(
        new mongoose.Types.ObjectId(commentId)
    );

    if (!comment) {
        throw new ApiError(500, "Something went wrong while deleting comment");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { deletedComment: comment },
            "Comment deleted successfully"
        )
    );
});

export { getVideoComments, addComment, updateComment, deleteComment };
