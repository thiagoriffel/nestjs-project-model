import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class UsersTable1756229036549 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`)

        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    new TableColumn({name: "id", type: "uuid", isPrimary: true, default: "gen_random_uuid()"}),
                    new TableColumn({name: "name", type: "varchar"}),
                    new TableColumn({name: "email", type: "varchar", isUnique: true}),
                    new TableColumn({name: "password", type: "varchar", isNullable: true}),
                    new TableColumn({name: "role", type: "varchar", default: 'user'}),
                    new TableColumn({ name: "created_at", type: "timestamptz", default: "now()" }),
                    new TableColumn({ name: "updated_at", type: "timestamptz", default: "now()" })
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users', true)
    }

}
