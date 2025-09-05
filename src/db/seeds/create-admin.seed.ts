import { DataSource } from 'typeorm';
import { UserRoleEnum } from '../entities/enum/user.enum';
import { UserEntity } from '../entities/user.entity';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export async function createAdmin(ds: DataSource) {
  const repo = ds.getRepository(UserEntity);

    const password = '123456'
    const salt = randomBytes(8).toString('hex');
    const hash = await scrypt(password, salt, 32) as Buffer
    const saltAndHas = `${salt}.${hash.toString('hex')}`

    const saveUser = {
        email: 'admin@email.com',
        name: 'Admin System User',
        role: UserRoleEnum.ADMIN,
        password: saltAndHas
    }
    
    const user = await repo.save(saveUser);

  console.log(`👑 Usuário admin criado: ${user.name}`);
}