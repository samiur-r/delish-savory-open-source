import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import morganMiddleware from './middlewares/MorganMiddleware';
import errorHandlingMiddleware from './middlewares/ErrorHandlingMiddleware';
import corsOptions from './config/corsOption';

import userRoutes from './api/v1/users';

const app: Express = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(morganMiddleware);

app.use('/api/v1/user', userRoutes);

app.use(errorHandlingMiddleware);

export default app;
