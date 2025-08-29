import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { UserRoleEnum } from './enum/user.enum';
import { StatusEnum } from './enum/status.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;
  
  @Column({ type: 'varchar', default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @Column({ default: StatusEnum.ACTIVE })
  status: string;

  @Column('uuid', { name: 'organization_id' })
  organization_id: string;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.users, { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}