import {
  BeforeSoftRemove,
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
} from 'typeorm';
import { LanguageModel } from '../../../business-layer/i18n/model/language.model';
import { BaseEntity } from '../../../models/entity/base-entity.entity';
import { FileEntity } from '../../file-entity/entities/file.entity';
import { USER_GENDER } from './enums/user.gender';
import { USER_ROLE } from './enums/user.roles';
import { USER_STATUS } from './enums/user.status';

@Entity('users')
export class UserEntity extends BaseEntity {
  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeSoftRemove()
  updateStatus() {
    this.status = USER_STATUS.DELETED;
  }

  @Column({ type: 'timestamp', nullable: true })
  lastActivityDate: Date;

  @Column({ type: 'varchar', nullable: true, length: 120 })
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  surname: string;

  // AUTH DATA - start

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'boolean', nullable: true })
  isAccountVerified: boolean;

  @Column({ type: 'varchar', nullable: true, length: 64 })
  activateAccountToken: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  activateAccountTokenExpirationDate: Date;

  // remind password
  @Column({ type: 'varchar', nullable: true, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 64 })
  remindPasswordToken: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  remindPasswordTokenExpirationDate: Date;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    nullable: false,
  })
  role: USER_ROLE;

  @Column({
    type: 'enum',
    enum: USER_STATUS,
    default: USER_STATUS.WAITING_FOR_ACCEPTANCE,
  })
  status: USER_STATUS;

  @Column({
    type: 'enum',
    enum: LanguageModel.LANGUAGE,
    nullable: false,
    default: LanguageModel.LANGUAGE.EN,
  })
  lang: LanguageModel.LANGUAGE;

  @Column({
    type: 'enum',
    enum: USER_GENDER,
    nullable: true,
  })
  gender: USER_GENDER;

  @OneToMany(() => FileEntity, (entity) => entity.user, {})
  files: FileEntity[];
}
