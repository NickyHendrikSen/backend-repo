require("dotenv").config();
import express, { NextFunction, Request, Response } from "express"
export const app = express()
import cors from "cors"
import cookieParser from "cookie-parser"

import ApiError, { errorHandler } from "./entities/ApiError"

import userRoutes from "./routes/userRoutes"

app.use(express.json({limit: "50mb"}))

app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}))

app.use(userRoutes)

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  })
})

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ApiError(`Route ${req.originalUrl} not found`, 500) as any
  err.statusCode = 404
  next(err)
})


app.use(errorHandler);