import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from 'src/db/entities/user.entity';
import { Repository, ILike } from 'typeorm';
import { CreateUsersDTO } from './users.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { EmailService } from 'src/mailer/mailer.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
  ) {}
  
    async create(createUserDto: CreateUsersDTO){
      const email = createUserDto.email
      let user = await this.usersRepository.findOneBy({email})
      if (user)
        return new BadRequestException('E-mail in use');

      const passwordBase64 = randomBytes(9).toString('base64')
      const password = passwordBase64.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
      const salt = randomBytes(8).toString('hex');
      const hash = await scrypt(password, salt, 32) as Buffer
      const saltAndHas = `${salt}.${hash.toString('hex')}`

      const saveUser = {
        email: createUserDto.email,
        name: createUserDto.name,
        role: UserRole.USER,
        password: saltAndHas
      }
      
      try {
        await this.emailService.sendPassword(createUserDto.email, createUserDto.name, password)
        user = await this.usersRepository.save(saveUser)
      } catch (err) {
        console.error('[Email] Falha ao enviar email de boas-vindas:', err?.message || err)
      }

      return user
    }

    async findAll(filter: string) {
      const trimmed = (filter ?? '').trim();

      const where = trimmed
        ? [
            { name: ILike(`%${trimmed}%`) },
            { email: ILike(`%${trimmed}%`) },
          ]
        : undefined;

      return this.usersRepository.find({
        where,
        order: { created_at: 'DESC' },
      });
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
      return this.usersRepository.findOneBy({email});
    }
}
