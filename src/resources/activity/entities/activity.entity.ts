import { StepEntity } from "@src/resources/step/entities/step.entity";
import { UserEntity } from "@src/resources/user/entities/user.entity";
import { DefaultEntity } from "@src/shared/models/entity-base";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity('activity')
export class ActivityEntity extends DefaultEntity {
    @Column({ length: 100 })
    title: string;

    @Column({ length: 200 })
    description: string;

    @OneToMany(() => StepEntity, step => step.activity)
    steps: StepEntity[];

    @Column('decimal', { default: 0 })
    price: number;

    @Column({ length: 45, nullable: true })
    levelName: string;

    @Column({ length: 45, nullable: true })
    levelTag: string;

    @Column({ length: 100, nullable: true })
    thumbnail: string;

    @Column('decimal', { default: 0 })
    unlockPrice: number;

    @ManyToMany(() => UserEntity, user => user.activities)
    @JoinTable()
    users: UserEntity[];
}