import { NextFunction, Request, Response } from 'express';

import { verifyJwt } from '../utils/jwtUtils';
import ErrorHandler from '../utils/ErrorHandler';

export const isUserAuth = async (req: Request, res: Response, next: NextFunction) => {
  const { signedCookies = {} } = req;
  const { token } = signedCookies;

  try {
    const user = await verifyJwt(token);
    res.locals.user = user;
    next();
  } catch (err) {
    next(new ErrorHandler(401, 'You are not authorized'));
  }
};

export const isRequestAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  try {
    await verifyJwt(token as string);
    next();
  } catch (err) {
    next(new ErrorHandler(401, 'You are not authorized'));
  }
};
