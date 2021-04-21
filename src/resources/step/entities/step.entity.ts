import { ActivityEntity } from "@src/resources/activity/entities/activity.entity";
import { DefaultEntity } from "@src/shared/models/entity-base";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('step')
export class StepEntity extends DefaultEntity {
    @Column()
    index: number;

    @Column({ length: 45 })
    type: string;

    @Column('jsonb')
    content: any;

    @ManyToOne(() => ActivityEntity, activity => activity.steps)
    activity: ActivityEntity;
}