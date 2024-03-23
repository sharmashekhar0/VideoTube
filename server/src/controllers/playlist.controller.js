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

    const playlist = await Playlist.findById(
        new mongoose.Types.ObjectId(playlistId)
    );

    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            { playlist: playlist },
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
