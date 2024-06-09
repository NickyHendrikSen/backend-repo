require("dotenv").config()
import { NextFunction, Response, Request } from 'express';
import firebaseConfig from '../config/firebaseConfig';
import UserRepository from '../repositories/userRepository';
import ApiError from '../entities/ApiError';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean;
}

const tokenExpire = parseInt(process.env.TOKEN_EXPIRE || '24')

export const tokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + tokenExpire * 24 * 60 * 60 * 1000),
  maxAge: tokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax'
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body; // Get user data from the request body
    const users = await UserRepository.addUser(userData);
    res.status(201).send({ message: 'User registered successfully', users: users });
  } catch (error) {
    console.error('User registration error: ', error);
    const err = new ApiError('User registration error', 500);
    next(err);
  }
}

export const fetchUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserRepository.getUsers();
    res.status(200).send({ message: 'Users fetched successfully', users: users });
  } catch (error) {
    console.error('Error fetching user: ', error);
    const err = new ApiError('Error Fetching User', 500);
    next(err);
  }
}

export const fetchSingleUserData = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  try {
    const user = await UserRepository.getUser(id);
    res.status(200).send({ message: 'User fetched successfully', user: user });
  } catch (error) {
    console.error('Error fetching user: ', error);
    const err = new ApiError('Error Fetching User', 500);
    next(err);
  }
}

export const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body; // Get user data from the request body
    await UserRepository.updateUser(userData?.id, userData)
    res.status(201).send({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user: ', error);
    const err = new ApiError('Error Updating User', 500);
    next(err);
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await UserRepository.getUserByEmail(email);

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    
    if(process.env.NODE_ENV === 'production') {
      tokenOptions.secure = true
    }

    res.cookie("token", token, tokenOptions)

    // Send token in response
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    next(new ApiError("Internal server error", 500));
  }
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie("token", "", {maxAge: 1})
    res.status(200).json({
      success: true,
      message: "Logged out successfully!"
    })
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
}

export const getUserInfo = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user
    const user = await UserRepository.getUser(userId);

    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: "Success", user });
  } catch (error: any) {
    next(new ApiError(error.message, 500));
  }
}
