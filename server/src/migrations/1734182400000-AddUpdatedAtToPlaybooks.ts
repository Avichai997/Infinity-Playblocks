import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUpdatedAtToPlaybooks1734182400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'playbooks',
      new TableColumn({
        name: 'updatedAt',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('playbooks', 'updatedAt');
  }
}
