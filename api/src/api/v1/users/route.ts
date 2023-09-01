import express from 'express';

import * as UserController from './controller';

const router = express.Router();

router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.post('/register', UserController.register);
router.post('/password-reset', UserController.resetPassword);

export default router;
