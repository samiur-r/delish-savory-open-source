import { NextFunction, Request, Response } from 'express';

import ErrorHandler from '../../../utils/ErrorHandler';
import { verifyToken } from '../../../utils/passwordUtils';
import config from '../../../config';
import { findUserByPhone, updateUserPassword } from './service';
import logger from '../../../utils/logger';
import { phoneSchema, passwordSchema } from './validation';
import { signJwt } from '../../../utils/jwtUtils';
import { saveUserLog } from '../user_logs/service';

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, password } = req.body;

  try {
    await phoneSchema.validate(phone, { abortEarly: false });
    await passwordSchema.validate(password, { abortEarly: false });

    const user = await findUserByPhone(phone);
    if (!user) return res.status(200).json({ isRedirectToRegister: true });

    const isValidPassword = await verifyToken(password, user.password);
    if (!isValidPassword) throw new ErrorHandler(403, 'Incorrect phone or password');

    const userPayload = {
      id: user.id,
      phone: user.phone,
    };

    const token = await signJwt(userPayload);

    logger.info(`User: ${user?.phone} logged in successfully`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: user.phone, activity: 'Logged in successfully' },
    ]);

    // @ts-ignore
    res.cookie('token', token, config.cookieOptions);
    return res.status(200).json({ success: userPayload }); // Logged in successfully
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    logger.error(`${error.name}: ${error.message}`);
    logger.error(`User: ${phone} logged in attempt failed`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: phone, activity: 'Logged in attempt failed' },
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

const doesUserExists = async (req: Request, res: Response, next: NextFunction) => {
  const { phone } = req.body;

  try {
    await phoneSchema.validate(phone, { abortEarly: false });
    const user = await findUserByPhone(phone);

    if (!user) throw new ErrorHandler(404, 'No user with this phone is found. Please register');

    return res.status(200).json({ userId: user.id });
  } catch (error) {
    logger.error(`${error.name}: ${error.message}`);
    return next(error);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, password } = req.body;
  let user: any;

  try {
    await phoneSchema.validate(phone, { abortEarly: false });
    await passwordSchema.validate(password, { abortEarly: false });

    user = await findUserByPhone(phone);

    if (!user) throw new ErrorHandler(404, 'No user with this phone is found. Please register');

    await updateUserPassword(user, password);

    logger.info(`Password reset attempt by user ${phone} successful`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: phone, activity: 'Password reset attempt successful' },
    ]);

    const userPayload = {
      id: user.id,
      phone: user.phone,
    };

    const token = await signJwt(userPayload);
    // @ts-ignore
    res.cookie('token', token, config.cookieOptions);
    return res.status(200).json({ success: userPayload });
  } catch (error) {
    logger.error(`${error.name}: ${error.message}`);
    await saveUserLog([
      { post_id: undefined, transaction: undefined, user: 'phone', activity: 'Password reset attempt failed' },
    ]);
    return next(error);
  }
};

const register = async (req: Request, res: Response) => {
  return res.status(200).json({ success: true });
};

export { login, logout, register, doesUserExists, resetPassword };
