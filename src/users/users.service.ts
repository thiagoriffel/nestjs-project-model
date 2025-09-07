import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { Repository, ILike } from 'typeorm';
import { UsersCreateDTO, UserPaginationDto, UsersUpdateDTO } from './users.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { EmailService } from 'src/mailer/mailer.service';
import { UserRoleEnum } from 'src/db/entities/enum/user.enum';
import { SesmailService } from 'src/sesmail/sesmail.service';
import { SesmailPasswordSendDTO, SesmailSendDTO } from 'src/sesmail/sesmail.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly emailService: EmailService,
    private readonly sesmailService: SesmailService,
  ) {}
  
    async create(createUserDto: UsersCreateDTO){
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
        role: UserRoleEnum.USER,
        password: saltAndHas,
        organization_id: createUserDto.organization_id
      }
      
      try {
        // user = await this.usersRepository.save(saveUser)
        // await this.emailService.sendPassword(createUserDto.email, createUserDto.name, password)
        await this.sesmailService.sendPassword(createUserDto.email, createUserDto.name, password)
      } catch (err) {
        return new InternalServerErrorException(err?.message || err);
      }

      return user
    }

    async findAll({ page = 1, limit = 20, q }: UserPaginationDto) {
        const where = q
          ? [
              { name: ILike(`%${q}%`) },
              { email: ILike(`%${q}%`) }]
          : {};
        const [data, total] = await this.usersRepository.findAndCount({
          where,
          order: { created_at: 'DESC' },
          skip: (page - 1) * limit,
          take: limit,
        });
        return { data, total, page, limit };
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
      return this.usersRepository.findOneBy({email});
    }
    
    async findOne(id: string) {
      const org = await this.usersRepository.findOne({
        where: { id }
      });
      if (!org) throw new NotFoundException('User not found');
      return org;
    }
    
    async update(id: string, dto: UsersUpdateDTO) {
      const org = await this.findOne(id)
      Object.assign(org, dto)
      return this.usersRepository.save(org)
    }
  
    async remove(id: string) {
      const org = await this.findOne(id);
      await this.usersRepository.remove(org);
      return { org};
    }
}
