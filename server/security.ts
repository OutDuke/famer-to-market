import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

/**
 * Configure Helmet security headers while remaining compatible with
 * the sandboxed dev iframe preview.
 */
export function getHelmetMiddleware() {
  return helmet({
    // Disable frameguard so that preview iframes function normally
    frameguard: false,
    // Content Security Policy is configured to not block internal assets or inline styles
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });
}

/**
 * Configure CORS allowing local, cloud run, and client requests
 */
export function getCorsMiddleware() {
  const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").filter(Boolean);

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for AI studio dev preview
    },
    credentials: true,
  };

  return cors(corsOptions);
}

/**
 * Global rate limiter for API endpoints
 */
export function getApiRateLimiter() {
  return rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 120, // 120 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too many requests from this IP, please try again in a moment.",
    },
  });
}

/**
 * Central Global Error Handler
 */
export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Unhandled API Error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
    status,
    timestamp: new Date().toISOString(),
  });
}
