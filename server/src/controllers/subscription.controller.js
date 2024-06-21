import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel id is required");
    }

    const channel = await Subscription.findOne({
        subscriber: new mongoose.Types.ObjectId(req.user?._id),
        channel: new mongoose.Types.ObjectId(channelId),
    });

    let isSubscribed;

    if (channel) {
        await Subscription.findByIdAndDelete(channel._id);
        isSubscribed = false;
    } else {
        await Subscription.create({
            channel: channelId,
            subscriber: req.user?._id,
        });
        isSubscribed = true;
    }

    const message = isSubscribed
        ? "Channel subscribed successfully"
        : "Channel unsubscribed successfully";

    return res
        .status(200)
        .json(new ApiResponse(200, { success: true }, message));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel id is required");
    }

    const subscribers = await Subscription.aggregate([
        [
            {
                $match: {
                    channel: new mongoose.Types.ObjectId(channelId),
                },
            },
            {
                $group: {
                    _id: "$channel",
                    subscriberCount: {
                        $sum: 1,
                    },
                },
            },
            {
                $addFields: {
                    subscriberCount: "$subscriberCount",
                },
            },
        ],
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            { subscribers: subscribers },
            "Channel subscriber fetched successfully"
        )
    );
});

const getChannelSubscribersList = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Channel id is required");
    }

    console.log("here");

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails",
            },
        },
        {
            $group: {
                _id: "$channel",
                subscriberDetails: {
                    $push: "$subscriberDetails",
                },
            },
        },
        {
            $unwind: "$subscriberDetails",
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Subscribers fetched successfully"
            )
        );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId) {
        throw new ApiError(400, "Subscriber id is required");
    }

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $project: {
                channel: 1,
            },
        },
    ]);

    res.status(200).json(
        new ApiResponse(
            200,
            { channelSubscribed: channels },
            "Subscribed channel fetched successfully"
        )
    );
});

const getChannelSubscriptionById = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    console.log(req.params);

    if (!channelId) {
        throw new ApiError("Channel ID is Required");
    }

    const isSubscribed = await Subscription.findOne({
        subscriber: req.user?._id,
        channel: new mongoose.Types.ObjectId(channelId),
    });

    res.status(200).json(
        new ApiResponse(
            200,
            { isSubscribed: isSubscribed ? true : false },
            "Channel Subscription fetched successfully"
        )
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getChannelSubscribersList,
    getChannelSubscriptionById,
};
