import { DataSource } from 'typeorm';

import { Playbook } from '@/playbooks/entities';
import { User } from '@/users/entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'playbook_db',
  entities: [User, Playbook],
  migrations: [
    process.env.NODE_ENV === 'production' ? 'dist/migrations/*.js' : 'src/migrations/*.ts',
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
