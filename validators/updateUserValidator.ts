import { check, body, ValidationChain, validationResult } from 'express-validator';
import UserRepository from '../repositories/userRepository';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../entities/ApiError';

export default [
  check('name').optional()
    .isLength({ max: 20 }).withMessage('Name must be at most 20 characters long.')
    .matches(/^[a-zA-Z\s]*$/).withMessage('Name must contain only letters and spaces.'),
  check('email').optional()
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value: any, { req }: {req: any}) => {
      return UserRepository.getUserByEmail(value).then((data) => {
        if (data && data.id !== req.body.id) {
          throw new ApiError('Email already exists.', 500);
        }
      })
    })
    .normalizeEmail(),
  check('age').optional()
    .isInt({min: 1}).withMessage('Age must be a number.'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          next(new ApiError(errors.array()[0]?.msg.toString(), 500))
        next();
    }
  ] as ValidationChain[]