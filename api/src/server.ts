import app from './app';
import config from './config';
import logger from './utils/logger';
import AppDataSource from './db';

AppDataSource.initialize()
  .then(() => {
    logger.info('Connected to database');
    app.listen(config.port, () => {
      logger.info(`🚀 Listening on ${config.port} with NODE_ENV=${config.nodeEnv} 🚀`);
    });
  })
  .catch((error: any) => logger.error(`Failed to connect to database ${error}`));
