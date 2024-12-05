import express from "express"
import { signup } from "../controllers/auth.contoller.js";

const router = express.Router();

router.get("/login", signup)





export default router