import { NextFunction, Response, Request } from 'express';
import firebaseConfig from '../config/firebaseConfig';
import UserRepository from '../repositories/userRepository';
import ApiError from '../entities/ApiError';


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
    console.error('Error adding user: ', error);
    res.status(500).send({ message: 'Error adding user', error });
  }
}