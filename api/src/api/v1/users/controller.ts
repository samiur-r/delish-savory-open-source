import { NextFunction, Request, Response } from 'express';

import ErrorHandler from '../../../utils/ErrorHandler';
import { hashPassword, verifyToken } from '../../../utils/passwordUtils';
import config from '../../../config';
import { findUserByEmail, saveUser, updateUserPassword } from './service';
import logger from '../../../utils/logger';
import { emailSchema, passwordSchema } from './validation';
import { signJwt } from '../../../utils/jwtUtils';
import { saveUserLog } from '../user_logs/service';
import { IUser } from './interfaces';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    await email.validate(email, { abortEarly: false });
    await passwordSchema.validate(password, { abortEarly: false });

    const user = await findUserByEmail(email);
    if (user) throw new ErrorHandler(409, 'User with this email already exists. Please login');

    const hashedPassword = await hashPassword(password);

    const userObj: IUser = await saveUser(email, hashedPassword);

    logger.info(`User ${email} registered successfully`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: email, activity: 'Registration attempt successful' },
    ]);

    const userPayload = {
      id: userObj.id,
      email: userObj.email,
    };

    const token = await signJwt(userPayload);
    // @ts-ignore
    res.cookie('token', token, config.cookieOptions);

    return res.status(200).json({ success: 'Registration attempt successful' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.error(`${error.name}: ${error.message}`);
    logger.error(`Registration attempt failed by user ${email}`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: email, activity: 'Registration attempt failed' },
    ]);

    return next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    await emailSchema.validate(email, { abortEarly: false });
    await passwordSchema.validate(password, { abortEarly: false });

    const user = await findUserByEmail(email);
    if (!user) throw new ErrorHandler(404, 'No user with this email is found. Please register');

    const isValidPassword = await verifyToken(password, user.password);
    if (!isValidPassword) throw new ErrorHandler(403, 'Incorrect phone or password');

    const userPayload = {
      id: user.id,
      email: user.email,
    };

    const token = await signJwt(userPayload);

    logger.info(`User: ${user?.email} logged in successfully`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: user.email, activity: 'Logged in successfully' },
    ]);

    // @ts-ignore
    res.cookie('token', token, config.cookieOptions);
    return res.status(200).json({ success: userPayload }); // Logged in successfully
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    logger.error(`${error.name}: ${error.message}`);
    logger.error(`User: ${email} logged in attempt failed`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: email, activity: 'Logged in attempt failed' },
    ]);
    if (error.name === 'ValidationError') {
      error.message = 'Invalid payload passed';
    }
    return next(error);
  }
};

const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token');
  return res.status(200).json({ success: 'Logged out successfully' });
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let user: any;

  try {
    await emailSchema.validate(email, { abortEarly: false });
    await passwordSchema.validate(password, { abortEarly: false });

    user = await findUserByEmail(email);

    if (!user) throw new ErrorHandler(404, 'No user with this email is found. Please register');

    await updateUserPassword(user, password);

    logger.info(`Password reset attempt by user ${email} successful`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: email, activity: 'Password reset attempt successful' },
    ]);

    const userPayload = {
      id: user.id,
      email: user.email,
    };

    const token = await signJwt(userPayload);
    // @ts-ignore
    res.cookie('token', token, config.cookieOptions);
    return res.status(200).json({ success: userPayload });
  } catch (error) {
    logger.error(`${error.name}: ${error.message}`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: 'email', activity: 'Password reset attempt failed' },
    ]);
    return next(error);
  }
};

export { login, logout, register, resetPassword };
