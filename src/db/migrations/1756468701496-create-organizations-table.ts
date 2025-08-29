import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateOrganizationsTable1756468701496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'organizations',
                columns: [
                    new TableColumn({ name: "id", type: "uuid", isPrimary: true, default: "gen_random_uuid()" }),
                    new TableColumn({ name: "name", type: "varchar" }),
                    new TableColumn({ name: "document", type: "varchar" }),
                    new TableColumn({ name: "status", type: "varchar", default: "'active'" }),
                    new TableColumn({ name: "created_at", type: "timestamptz", default: "now()" }),
                    new TableColumn({ name: "updated_at", type: "timestamptz", default: "now()" })
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('organizations', true)
    }

}
