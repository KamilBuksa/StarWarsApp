import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity as BaseEntityTypeOrm,
} from 'typeorm';

export class BaseEntity extends BaseEntityTypeOrm {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  modifiedAt: string;
}

// @DeleteDateColumn()
// deletedAt?: Date

// @BeforeSoftRemove()
// updateStatus() {
//   this.status = PREFERENCE_STATUS.DELETED
// }
