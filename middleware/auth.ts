import { Request, Response, NextFunction, json } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../entities/ApiError";

export const isAuth = async(req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if(!token) {
    return next(new ApiError("Token Missing.", 400));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    req.user = decoded.user; // Attach user data to request object for use in route handlers
    next();
  }
  catch (error) {
    return next(new ApiError("Access token is not valid.", 401));
  }
}