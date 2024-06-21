import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers,
    getChannelSubscribersList,
    getChannelSubscriptionById,
} from "../controllers/subscription.controller.js";

const router = Router();

router.use(verifyJWT);

router
    .route("/c/:channelId")
    .get(getUserChannelSubscribers)
    .post(toggleSubscription);

router.route("/c/channel/subscribers/").get(getChannelSubscribersList);

router.route("/u/:subscriberId").get(getSubscribedChannels);

router
    .route("/c/channel/subscribed/:channelId")
    .get(getChannelSubscriptionById);

export default router;
