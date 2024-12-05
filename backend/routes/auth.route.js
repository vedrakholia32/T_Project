import express from "express"
import { signup, login, logout, getMe } from "../controllers/auth.contoller.js"
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me",protectRoute, getMe)
router.get("/logout", logout)
router.post("/signup", signup)
router.post("/login", login)


export default router