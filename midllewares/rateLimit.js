import rateLimit from "express-rate-limit";
import { HttpCode } from "../lib/constants";

const limiter = (duration, limit) => {
  return rateLimit({
    windowMs: duration, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      return res.status(HttpCode.TOO_MANY_REQUESTS).json({
        status: "error",
        code: HttpCode.TOO_MANY_REQUESTS,
        message: "Too many requests, please try again later.",
      });
    },
  });
};

export default limiter;
