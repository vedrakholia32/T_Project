import express from "express"
import authRoutes from "./routes/auth.route.js"
import { configDotenv } from "dotenv"
import connectMongo from "./db/connectDb.js"
configDotenv()

const app = express()



app.get("/apir/auth", authRoutes)

app.listen(process.env.PORT, () => {
    console.log('server is running');
    connectMongo()

})