import { check, body, ValidationChain, validationResult } from 'express-validator';
import UserRepository from '../repositories/userRepository';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../entities/ApiError';

export default [
  check('name')
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 20 }).withMessage('Name must be at most 20 characters long.')
    .matches(/^[a-zA-Z\s]*$/).withMessage('Name must contain only letters and spaces.'),
  check('email')
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value: any, { next }: {next: NextFunction}) => {
      return UserRepository.getUserByEmail(value).then((data) => {
        if (data) {
          throw new ApiError('Email already exists.', 500);
        }
      })
    })
    .normalizeEmail(),
  check(
    'password',
    'Please enter a password with only numbers and text and at least 8 characters.'
  )
    .isLength({ min: 8 })
    .isAlphanumeric()
    .trim(),
  check('confirmPassword')
    .trim()
    .custom((value: any, { req }: { req: any }) => {
      if (value !== req.body?.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    }),
  check('age')
    .notEmpty().withMessage('Age is required.')
    .isNumeric().withMessage('Age must be a number.'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          throw new Error(errors.array()[0]?.msg.toString())
          // next(new ErrorHandler(errors.array()[0]?.msg.toString(), 400))
        next();
    }
  ] as ValidationChain[]