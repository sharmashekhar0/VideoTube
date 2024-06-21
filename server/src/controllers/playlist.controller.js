import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const createUserPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and Description is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId,
    });

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating playlist");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { playlistDetails: playlist },
            "Playlist created successfully"
        )
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User id is required");
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                videos: 1,
            },
        },
    ]);

    if (!playlists) {
        throw new ApiError(
            500,
            "Something went wrong while getting user playlists"
        );
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { playlists: playlists },
            "Playlists fetched successfully"
        )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    const singlePlaylist = await Playlist.findById(playlistId);
    console.log(singlePlaylist);

    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos", // Assuming your videos collection is named "videos"
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            },
        },
        {
            $lookup: {
                from: "users", // Assuming your videos collection is named "videos"
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },
        {
            $unwind: "$ownerDetails",
        },
        {
            $unwind: "$videos", // Unwind the videos array to lookup owner details for each video
        },
        {
            $lookup: {
                from: "users", // Assuming your users collection is named "users"
                localField: "videos.owner",
                foreignField: "_id",
                as: "videos.ownerDetails",
            },
        },
        {
            $unwind: "$videos.ownerDetails", // Unwind the ownerDetails array to convert it from array to object
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                owner: { $first: "$owner" },
                ownerDetails: { $first: "$ownerDetails" },
                description: { $first: "$description" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                videos: {
                    $push: {
                        _id: "$videos._id",
                        title: "$videos.title",
                        description: "$videos.description",
                        videoFile: "$videos.videoFile",
                        thumbnail: "$videos.thumbnail",
                        duration: "$videos.duration",
                        views: "$videos.views",
                        isPublished: "$videos.isPublished",
                        owner: {
                            _id: "$videos.ownerDetails._id",
                            fullName: "$videos.ownerDetails.fullName",
                            username: "$videos.ownerDetails.username",
                            email: "$videos.ownerDetails.email",
                            avatar: "$videos.ownerDetails.avatar",
                            coverImage: "$videos.ownerDetails.coverImage",
                        },
                    },
                },
            },
        },
        {
            $addFields: {
                createdAt: "$createdAt", // Explicitly include the createdAt field
                updatedAt: "$updatedAt", // Explicitly include the updatedAt field
            },
        },
    ];

    const playlist = await Playlist.aggregate(pipeline);

    if (!playlist || playlist.length === 0) {
        throw new ApiError(404, "Playlist not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { playlist: playlist[0] }, // Assuming you want to return just one playlist
            "Playlist fetched successfully"
        )
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist is required");
    }

    const playlist = await Playlist.findById(
        new mongoose.Types.ObjectId(playlistId)
    );

    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    if (playlist.videos.indexOf(videoId) !== -1) {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { playlist: playlist },
                    "Video already added"
                )
            );
    }

    playlist.videos.push(videoId);

    const updatedPlaylist = await playlist.save({ new: true });

    res.status(200).json(
        new ApiResponse(
            200,
            { playlist: updatedPlaylist },
            "Video added to playlist"
        )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }

    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    const playlist = await Playlist.findById(
        new mongoose.Types.ObjectId(playlistId)
    );

    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    const index = playlist.videos.indexOf(videoId);

    if (index === -1) {
        res.status(200).json(
            new ApiResponse(
                200,
                { playlist: playlist },
                "Video already removed from playlist"
            )
        );
    }

    playlist.videos.splice(index, 1);

    const updatedPlaylist = await playlist.save({ new: true });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { playlist: updatedPlaylist },
                "Video removed from playlist"
            )
        );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    if (!playlistId) {
        throw new ApiError(400, "Playlist id is required");
    }

    const result = await Playlist.findByIdAndDelete(
        new mongoose.Types.ObjectId(playlistId)
    );

    if (!result) {
        throw new ApiError(500, "Something went wrong while deleting playlist");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { result: result },
            "Playlist deleted successfully"
        )
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const { playlistId } = req.params;

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    if (!playlistId) {
        throw new ApiError(400, "Playlist id is not found or invalid");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        new mongoose.Types.ObjectId(playlistId),
        {
            $set: {
                name: name,
                description: description,
            },
        },
        {
            new: true,
        }
    );

    res.status(200).json(
        new ApiResponse(
            200,
            { updatedPlaylist: updatedPlaylist },
            "Playlist updated successfully"
        )
    );
});

export {
    createUserPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
