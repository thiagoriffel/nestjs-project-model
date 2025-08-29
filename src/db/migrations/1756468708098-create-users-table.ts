import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateUsersTable1756468708098 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`)

        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    new TableColumn({ name: "id", type: "uuid", isPrimary: true, default: "gen_random_uuid()" }),
                    new TableColumn({ name: "name", type: "varchar" }),
                    new TableColumn({ name: "email", type: "varchar", isUnique: true }),
                    new TableColumn({ name: "password", type: "varchar", isNullable: true }),
                    new TableColumn({ name: "role", type: "varchar", default: "'user'" }),
                    new TableColumn({ name: "status", type: "varchar", default: "'active'" }),
                    new TableColumn({ name: "organization_id", type: "uuid" }),
                    new TableColumn({ name: "created_at", type: "timestamptz", default: "now()" }),
                    new TableColumn({ name: "updated_at", type: "timestamptz", default: "now()" })
                ]
            })
        )
        await queryRunner.createForeignKey(
          'users',
          new TableForeignKey({
            name: 'FK_users_organization',
            columnNames: ['organization_id'],
            referencedTableName: 'organizations',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
            onUpdate: 'NO ACTION',
          }),
        );
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('users');
        const fk = table?.foreignKeys.find(f => f.name === 'FK_users_organization');
        if (fk) {
          await queryRunner.dropForeignKey('users', fk);
        }
        await queryRunner.dropTable('users', true)
    }

}
