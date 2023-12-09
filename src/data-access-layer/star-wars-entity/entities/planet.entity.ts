import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    UpdateDateColumn
} from 'typeorm';
import { BaseEntity } from '../../../models/entity/base-entity.entity';

@Entity('planets')
export class PlanetEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt?: Date;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    rotationPeriod: string;

    @Column({ type: 'varchar', length: 255 })
    orbitalPeriod: string;

    @Column({ type: 'varchar', length: 255 })
    diameter: string;

    @Column({ type: 'varchar', length: 255 })
    climate: string;

    @Column({ type: 'varchar', length: 255 })
    gravity: string;

    @Column({ type: 'varchar', length: 255 })
    terrain: string;

    @Column({ type: 'varchar', length: 255 })
    surfaceWater: string;

    @Column({ type: 'varchar', length: 255 })
    population: string;

    @Column('simple-array', { nullable: true })
    residents: string[];

    @Column('simple-array', { nullable: true })
    films: string[];

    @CreateDateColumn()
    created: string;

    @UpdateDateColumn()
    edited: string;

    @Column({ type: 'varchar', length: 255 })
    url: string;


}
