import express from "express"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import { configDotenv } from "dotenv"
import connectMongo from "./db/connectDb.js"
import cookieParser from "cookie-parser"
configDotenv()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true})) // to parse from data(urlencoded)

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use(cookieParser())

app.listen(process.env.PORT, () => {
    console.log('server is running');
    connectMongo()

})