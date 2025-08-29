import { MigrationInterface, QueryRunner } from "typeorm";
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

export class SeedAdminTest1756473450981 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Garante que exista ao menos uma organização
        const org = await queryRunner.query(`
        INSERT INTO organizations (id, name, document, status, created_at, updated_at)
        VALUES (gen_random_uuid(), 'Empresa Admin', '00000000000000', 'active', now(), now())
        RETURNING id
        `);

        const orgId = org[0].id;

        // Hash da senha (ajusta rounds se quiser mais segurança)
        const password = '123'
        const salt = randomBytes(8).toString('hex');
        const hash = await scrypt(password, salt, 32) as Buffer
        const saltAndHas = `${salt}.${hash.toString('hex')}`

        await queryRunner.query(`
        INSERT INTO users (id, name, email, password, role, status, organization_id, created_at, updated_at)
        VALUES (gen_random_uuid(), 'Administrador', 'admin@email.com.br', '${saltAndHas}', 'admin', 'active', '${orgId}', now(), now())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users WHERE email = 'admin@example.com'`);
        await queryRunner.query(`DELETE FROM organizations WHERE name = 'Admin Org'`);
    }

}
