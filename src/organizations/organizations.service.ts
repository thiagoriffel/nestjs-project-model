import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { OrganizationEntity } from 'src/db/entities/organization.entity';
import { StatusEnum } from 'src/db/entities/enum/status.enum';
import { OrganizationsCreateDTO, OrganizationsPaginationDTO, OrganizationsUpdateDTO } from './organizations.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizationEntity: Repository<OrganizationEntity>,
  ) {}

  async create(createOrganizationDto: OrganizationsCreateDTO) {
    const document = createOrganizationDto.document
    const organization = await this.organizationEntity.findOneBy({ document })
    if (organization) return new BadRequestException('Organization in use');

    const entity = this.organizationEntity.create({
      name: createOrganizationDto.name,
      document: createOrganizationDto.document,
      status: StatusEnum.ACTIVE,
    })
    
    return this.organizationEntity.save(entity);
  }

  async findAll({ page = 1, limit = 20, q }: OrganizationsPaginationDTO) {
    const where = q
      ? [
          { name: ILike(`%${q}%`) },
          { document: ILike(`%${q}%`) }]
      : {};
    const [data, total] = await this.organizationEntity.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string, opts?: { withUsers?: boolean }) {
    const org = await this.organizationEntity.findOne({
      where: { id },
      relations: opts?.withUsers ? { users: true } : undefined,
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async update(id: string, dto: OrganizationsUpdateDTO) {
    const org = await this.findOne(id)
    Object.assign(org, dto)
    return this.organizationEntity.save(org)
  }

  async remove(id: string) {
    const org = await this.findOne(id, { withUsers: true });
    if (org.users.length > 0) throw new ForbiddenException('Have Users')
    await this.organizationEntity.remove(org);
    return { org};
  }
}
