require("dotenv").config()
import { NextFunction, Response, Request } from 'express';
import firebaseConfig from '../config/firebaseConfig';
import UserRepository from '../repositories/userRepository';
import ApiError from '../entities/ApiError';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


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

export const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body; // Get user data from the request body
    const users = await UserRepository.updateUser(userData?.id, userData)
    res.status(201).send({ message: 'Users fetched successfully', users: users });
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

    // Send token in response
    res.json({ token });
  } catch (error) {
    console.error(error);
    next(new ApiError("Internal server error", 500));
  }
}