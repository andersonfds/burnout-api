import { StepEntity } from "@src/resources/step/entities/step.entity";
import { DefaultEntity } from "@src/shared/models/entity-base";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('activity')
export class ActivityEntity extends DefaultEntity {
    @Column({ length: 100 })
    title: string;

    @Column({ length: 200 })
    description: string;

    @OneToMany(() => StepEntity, step => step.activity)
    steps: StepEntity[];
}