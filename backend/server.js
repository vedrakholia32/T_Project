import express from "express"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"
import { configDotenv } from "dotenv"
import connectMongo from "./db/connectDb.js"
import cookieParser from "cookie-parser"
import {v2 as cloudinary} from "cloudinary"
configDotenv()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const app = express()

app.use(express.json({limit:"5mb"}))
app.use(express.urlencoded({extended:true})) // to parse from data(urlencoded)

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notification", notificationRoutes)
app.use(cookieParser())

app.listen(process.env.PORT, () => {
    console.log('server is running');
    connectMongo()

})