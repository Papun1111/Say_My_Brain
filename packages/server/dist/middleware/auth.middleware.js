"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Middleware to protect routes by verifying a JWT.
 * It expects a token in the 'Authorization: Bearer <token>' header.
 * If the token is valid, it attaches the user's ID to the request object as 'req.user'.
 */
const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    // 1. Check if the Authorization header exists and is in the correct format
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }
    // 2. Extract the token from the "Bearer <token>" string
    const token = bearer.split(' ')[1]?.trim();
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }
    try {
        // 3. Verify the token using the secret key from your .env file
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 4. If verification is successful, attach the user's ID to the request object
        req.user = { id: decoded.id };
        // 5. Pass control to the next middleware or the route's controller
        // FIX: Add 'return' to make it explicit that this code path is complete.
        return next();
    }
    catch (e) {
        console.error('Token verification failed:', e);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.protect = protect;
