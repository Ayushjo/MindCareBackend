import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./db/index.js";
import logger from "./logger.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

const PORT = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js"
import chatWithBotRouter from "./routes/chatWithBotRoute.js"
import moodRoutes from "./routes/moodRoutes.js"
import journalRoutes from "./routes/journalRoutes.js"
app.use(
  cors({
    origin: "https://mindcare.iayush.com", // Your frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/users",userRoutes)
app.use("/api/users",chatWithBotRouter)
app.use("/api/mood",moodRoutes)

app.use("/api/journal",journalRoutes)
connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        logger.info(`Server is running on port ${PORT}`);
    })
})
.catch((error)=>{
    logger.error(error);
})

