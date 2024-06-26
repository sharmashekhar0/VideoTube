import { Router } from "express";
import {
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
    getUserChannelProfile,
    addVideoToWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/history/:videoId").post(verifyJWT, addVideoToWatchHistory);
router.route("/history").get(verifyJWT, getWatchHistory);
router.route("/c/:username").get(getUserChannelProfile);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);
router
    .route("/cover-image")
    .patch(verifyJWT, upload.single("coverImage"), updateCoverImage);

export default router;
