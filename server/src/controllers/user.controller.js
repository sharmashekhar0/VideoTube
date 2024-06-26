import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        console.log(user);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;

        if (
            [username, fullName, email, password].some(
                (field) => field?.trim() === ""
            )
        ) {
            throw new ApiError(401, "All fields are required");
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            throw new ApiError(401, "user already exists");
        }

        console.log("Req Files ::", req);

        const avatarLocalPath = req.files?.avatar[0]?.path;

        let coverImageLocalPath;

        if (
            req.files &&
            Array.isArray(req.files.coverImage) &&
            req.files.coverImage.length > 0
        ) {
            coverImageLocalPath = req.files?.coverImage[0]?.path;
        }

        console.log("Avatar local path :: ", avatarLocalPath);

        if (!avatarLocalPath) {
            throw new ApiError(401, "Avatar file required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);

        const coverImage = await uploadOnCloudinary(coverImageLocalPath);

        console.log("Works till here", avatar?.url);
        console.log("Works till here", coverImage?.url);

        const user = await User.create({
            username: username.toLowerCase(),
            fullName,
            email,
            password,
            avatar: avatar?.url,
            coverImage: coverImage?.url || "",
        });

        console.log("User :: ", user);

        const createdUser = await User.findById(user?._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(
                500,
                "Something went wrong while registering user"
            );
        }

        res.status(200).json(
            new ApiResponse(200, user, "User registered Successfully")
        );
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Something went wrong while registering user"
        );
    }
});

const login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Body :: ", req.body);

    if (!username || !email) {
        throw new ApiError(400, "Both username and email are required");
    }

    console.log(username);
    console.log(email);
    console.log(password);

    const user = await User.findOne({ username, email });

    console.log(user);

    if (!user) {
        throw new ApiError(
            400,
            "User does not exist with provided username and email"
        );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is invalid");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req?.user?._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "", "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Token Expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id);

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken },
                    "Access Token Refreshed Successfully"
                )
            );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message ||
                "Something went wrong while refreshing access token"
        );
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    const isPasswordValid = user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect Old Password");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, {}, "Password Changed Successfully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, req.user, "User Fetched Successfully")
    );

    // Another Approach
    // const user = await User.findById(req.user?._id).select(
    //     "-password -refreshToken"
    // );

    // if (!user) {
    //     throw new ApiError(400, "User Not Found");
    // }

    // res.status(200).json(
    //     new ApiResponse(
    //         200,
    //         { User: user },
    //         "Current User Fetched Successfully"
    //     )
    // );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { username, email, fullName } = req.body;

    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (fullName) updateFields.fullName = fullName;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: updateFields,
        },
        { new: true }
    ).select("-password -refreshToken");

    res.status(200).json(
        new ApiResponse(200, { User: user }, "Details Updated Successfully")
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    console.log(req);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true }
    ).select("-password -refreshToken");

    res.status(200).json(
        new ApiResponse(200, {}, "Avatar Updated Successfully")
    );
});

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file required");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url,
            },
        },
        { new: true }
    ).select("-password -refreshToken");

    res.status(200).json(
        new ApiResponse(200, {}, "Cover Image Updated Successfully")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing");
    }

    const channel = await User.aggregate([
        // Match the user by username
        {
            $match: {
                username: username?.toLowerCase(),
            },
        },
        // Lookup the subscribers for the user
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers",
            },
        },
        // Lookup the channels the user is subscribed to
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo",
            },
        },
        // Lookup the user details for the channels the user is subscribed to
        {
            $lookup: {
                from: "users",
                localField: "subscribedTo.channel",
                foreignField: "_id",
                as: "channelSubscribedTo",
            },
        },
        // Lookup the playlists owned by the user
        {
            $lookup: {
                from: "playlists",
                localField: "_id",
                foreignField: "owner",
                as: "playlists",
            },
        },
        // Lookup the videos owned by the user
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos",
            },
        },
        // Lookup the tweets owned by the user
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweets",
            },
        },
        // Add fields for subscriber count, subscription count, and whether the current user is subscribed
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers",
                },
                channelSubscribedToCount: {
                    $size: "$subscribedTo",
                },
                isSubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        // Lookup the subscriber count for each channel in the subscribedTo list
        {
            $lookup: {
                from: "subscriptions",
                let: { channelIds: "$subscribedTo.channel" },
                pipeline: [
                    // Match subscriptions where the channel is in the subscribedTo list
                    {
                        $match: {
                            $expr: { $in: ["$channel", "$$channelIds"] },
                        },
                    },
                    // Group by channel and count the number of subscribers
                    {
                        $group: {
                            _id: "$channel",
                            count: { $sum: 1 },
                        },
                    },
                ],
                as: "channelSubscriberCounts",
            },
        },
        // Add subscriber count to each channel in the channelSubscribedTo list
        {
            $addFields: {
                channelSubscribedTo: {
                    $map: {
                        input: "$channelSubscribedTo",
                        as: "channel",
                        in: {
                            $mergeObjects: [
                                "$$channel",
                                {
                                    subscriberCount: {
                                        $let: {
                                            vars: {
                                                countObj: {
                                                    $arrayElemAt: [
                                                        {
                                                            $filter: {
                                                                input: "$channelSubscriberCounts",
                                                                as: "count",
                                                                cond: {
                                                                    $eq: [
                                                                        "$$count._id",
                                                                        "$$channel._id",
                                                                    ],
                                                                },
                                                            },
                                                        },
                                                        0,
                                                    ],
                                                },
                                            },
                                            in: "$$countObj.count",
                                        },
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
        // Project the required fields
        {
            $project: {
                fullName: 1,
                username: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                channelSubscribedTo: 1,
                coverImage: 1,
                email: 1,
                videos: 1,
                tweets: 1,
                playlists: 1,
            },
        },
    ]);

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found");
    }

    res.status(200).json(
        new ApiResponse(200, channel[0], "User Channel Fetched Successfully")
    );
});

const addVideoToWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.params;
    console.log(videoId);

    // Remove videoId if it already exists in watchHistory
    await User.findByIdAndUpdate(
        userId,
        { $pull: { watchHistory: videoId } },
        { useFindAndModify: false }
    );

    // Add videoId to watchHistory
    const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { watchHistory: videoId } },
        { new: true, useFindAndModify: false }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: user },
                "Video added to watch history successfully"
            )
        );
});

const getWatchHistory = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;

    const watchHistory = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $unwind: "$watchHistory",
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "videoDetails",
            },
        },
        {
            $unwind: "$videoDetails",
        },
        {
            $lookup: {
                from: "users",
                localField: "videoDetails.owner",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },
        {
            $unwind: "$ownerDetails",
        },
        {
            $group: {
                _id: null,
                watchHistory: {
                    $push: {
                        video_details: "$videoDetails",
                        owner_details: "$ownerDetails",
                    },
                },
            },
        },
        {
            $unwind: "$watchHistory",
        },
        {
            $sort: {
                "watchHistory.video_details.updatedAt": -1,
            },
        },
        {
            $group: {
                _id: null,
                watchHistory: {
                    $push: "$watchHistory",
                },
            },
        },
        {
            $project: {
                _id: 0,
                watchHistory: 1,
            },
        },
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { watchHistory },
                "Watch history fetched successfully"
            )
        );
});

export {
    registerUser,
    login,
    logout,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage,
    getWatchHistory,
    addVideoToWatchHistory,
    getUserChannelProfile,
};
