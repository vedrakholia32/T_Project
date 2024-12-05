import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const rawCookies = req.headers.cookie; // Cookies as a string
        if (!rawCookies) {
            return res.status(401).json({ error: "Unauthorized: No Cookies Provided" });
        }

        const cookies = Object.fromEntries(
            rawCookies.split("; ").map(cookie => cookie.split("="))
        );

        const token =cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

