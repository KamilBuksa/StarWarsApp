import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    UpdateDateColumn
} from 'typeorm';
import { BaseEntity } from '../../../models/entity/base-entity.entity';

@Entity('species')
export class SpeciesEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt?: Date;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    classification: string;

    @Column({ type: 'varchar', length: 255 })
    designation: string;

    @Column({ type: 'varchar', length: 255 })
    averageHeight: string;

    @Column({ type: 'varchar', length: 255 })
    skinColors: string;

    @Column({ type: 'varchar', length: 255 })
    hairColors: string;

    @Column({ type: 'varchar', length: 255 })
    eyeColors: string;

    @Column({ type: 'varchar', length: 255 })
    averageLifespan: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    homeworld: string;

    @Column({ type: 'varchar', length: 255 })
    language: string;

    @Column('simple-array', { nullable: true })
    people: string[];

    @Column('simple-array', { nullable: true })
    films: string[];

    @CreateDateColumn()
    created: string;

    @UpdateDateColumn()
    edited: string;

    @Column({ type: 'varchar', length: 255 })
    url: string;


}
