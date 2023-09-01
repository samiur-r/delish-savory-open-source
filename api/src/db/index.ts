import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from '../api/v1/users/model';
import { UserLog } from '../api/v1/user_logs/model';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'boshamlan_dev',
  synchronize: true,
  logging: false,
  migrationsRun: false,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  entities: [User, UserLog],
});

export default AppDataSource;
