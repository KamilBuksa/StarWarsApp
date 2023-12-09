import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../models/entity/base-entity.entity';
import { UserEntity } from '../../user-entity/entities/user.entity';
import { FILE_CONTENT_TYPE } from './content.type';
import { FILE_STATUS } from './file.status';
import { FILE_TYPE } from './file.type';

@Entity('files')
export class FileEntity extends BaseEntity {
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'varchar' })
  originalname: string;

  @Column({ type: 'varchar', nullable: true })
  encoding: string;

  @Column({ type: 'varchar', nullable: true })
  mimetype: string;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'varchar', nullable: true })
  path: string;

  @Column({ type: 'boolean', nullable: true })
  isCompress: boolean;

  @Column({ type: 'boolean', default: false })
  isAssigned: boolean;

  @Column({ type: 'numeric', nullable: true })
  size: number;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  order: number;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({
    type: 'enum',
    enum: FILE_TYPE,
    nullable: true,
  })
  type: FILE_TYPE;

  @Column({
    type: 'enum',
    enum: FILE_CONTENT_TYPE,
    nullable: true,
  })
  contentType: FILE_CONTENT_TYPE;

  @Column({
    type: 'enum',
    enum: FILE_STATUS,
    nullable: true,
  })
  status: FILE_STATUS;

  @ManyToOne(() => UserEntity, (entity) => entity.files, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => FileEntity, (entity) => entity.files, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: ['update'],
  })
  @JoinColumn()
  compressFile: FileEntity;

  @OneToMany(() => FileEntity, (entity) => entity.compressFile, {
    onDelete: 'SET NULL',
  })
  files: FileEntity[];
}
