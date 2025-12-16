import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialSchema1735889231262 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create enum type for trigger
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "trigger_enum" AS ENUM ('MALWARE_DETECTED', 'LOGIN_ATTEMPT', 'PHISHING_ALERT');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create playbooks table
    await queryRunner.createTable(
      new Table({
        name: 'playbooks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'trigger',
            type: 'trigger_enum',
          },
          {
            name: 'actions',
            type: 'text',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create foreign key constraint
    await queryRunner.createForeignKey(
      'playbooks',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    // Create index on userId for better query performance
    await queryRunner.createIndex(
      'playbooks',
      new TableIndex({
        name: 'IDX_playbooks_userId',
        columnNames: ['userId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const playbooksTable = await queryRunner.getTable('playbooks');
    const foreignKey = playbooksTable?.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('playbooks', foreignKey);
    }

    // Drop tables
    await queryRunner.dropTable('playbooks');
    await queryRunner.dropTable('users');
  }
}
