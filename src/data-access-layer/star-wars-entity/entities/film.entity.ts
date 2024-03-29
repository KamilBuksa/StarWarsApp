import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { BaseEntity } from '../../../models/entity/base-entity.entity';

@Entity('films')
export class FilmEntity extends BaseEntity {
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'int' })
  episodeId: number;

  @Column({ type: 'text' })
  openingCrawl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  director: string;

  @Column({ type: 'varchar', length: 255 })
  producer: string;

  @Column({ type: 'date' })
  releaseDate: string;

  @Column('simple-array', { nullable: true })
  characters: string[];

  @Column('simple-array', { nullable: true })
  planets: string[];

  @Column('simple-array', { nullable: true })
  starships: string[];

  @Column('simple-array', { nullable: true })
  vehicles: string[];

  @Column('simple-array', { nullable: true })
  species: string[];

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'int', nullable: true })
  apiId: number;
}
