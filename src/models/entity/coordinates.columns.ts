import { Column } from 'typeorm';

export class Coordinates {
  @Column('double', { nullable: true })
  longitude: number;

  @Column('double', { nullable: true })
  latitude: number;
}
