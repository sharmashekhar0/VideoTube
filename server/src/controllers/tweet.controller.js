import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    if (!content) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.create({
        owner: req.user?._id,
        content: content?.trim() || "",
    });

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while tweeting");
    }

    res.status(200).json(
        new ApiResponse(200, { tweetDetails: tweet }, "Tweeted successfully")
    );
});

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const tweets = await Tweet.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
    ]);

    // TODO: Improve aggregation

    res.status(200).json(
        new ApiResponse(200, { tweets: tweets }, "Tweets fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;

    if (content?.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    if (!tweetId) {
        throw new ApiError(400, "Tweet id not found");
    }

    const tweet = await Tweet.findByIdAndUpdate(
        new mongoose.Types.ObjectId(tweetId),
        {
            $set: {
                content: content?.trim() || "",
            },
        },
        { new: true }
    );

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while updating tweet");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { updatedTweet: tweet },
            "Tweet updated successfully"
        )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Tweet id is required");
    }

    const result = await Tweet.findByIdAndDelete(
        new mongoose.Types.ObjectId(tweetId)
    );

    if (!result) {
        throw new ApiError(500, "Something went wrong while deleting tweet");
    }

    res.status(200).json(
        new ApiResponse(200, { result: result }, "Tweet deleted successfully")
    );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
