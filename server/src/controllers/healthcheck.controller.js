import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (_, res) => {
    res.status(200).json(
        new ApiResponse(200, { success: true }, "Everything seems fine")
    );
});

export { healthCheck };
