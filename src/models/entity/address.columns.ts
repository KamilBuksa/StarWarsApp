import { Column } from 'typeorm';

export class Address {
  @Column({ type: 'varchar', nullable: true, length: 200 })
  country: string;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  city: string;

  @Column({ type: 'varchar', nullable: true, length: 40 })
  zipCode: string;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  address: string;
}
