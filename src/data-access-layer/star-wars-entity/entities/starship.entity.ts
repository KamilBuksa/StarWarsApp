import {
    Column,
    DeleteDateColumn,
    Entity
} from 'typeorm';
import { BaseEntity } from '../../../models/entity/base-entity.entity';

@Entity('starships')
export class StarshipEntity extends BaseEntity {

    @DeleteDateColumn()
    deletedAt?: Date;
    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    model: string;

    @Column({ type: 'varchar', length: 255 })
    manufacturer: string;

    @Column({ type: 'varchar', length: 255 })
    costInCredits: string;

    @Column({ type: 'varchar', length: 255 })
    length: string;

    @Column({ type: 'varchar', length: 255 })
    maxAtmospheringSpeed: string;

    @Column({ type: 'varchar', length: 255 })
    crew: string;

    @Column({ type: 'varchar', length: 255 })
    passengers: string;

    @Column({ type: 'varchar', length: 255 })
    cargoCapacity: string;

    @Column({ type: 'varchar', length: 255 })
    consumables: string;

    @Column({ type: 'varchar', length: 255 })
    hyperdriveRating: string;

    @Column({ type: 'varchar', length: 255 })
    MGLT: string;

    @Column({ type: 'varchar', length: 255 })
    starshipClass: string;

    @Column('simple-array', { nullable: true })
    pilots: string[];

    @Column('simple-array', { nullable: true })
    films: string[];

    @Column({ type: 'varchar', length: 255 })
    url: string;

    @Column({ type: 'int', nullable: true })
    apiId: number;
}
