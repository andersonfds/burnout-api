import { Exclude } from "class-transformer";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";

export class DefaultEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Exclude()
    @Column({ type: 'timestamp', default: () => 'current_timestamp' })
    createdAt: Date;

    @Exclude()
    @Column({ type: 'timestamp', default: () => 'current_timestamp' })
    updatedAt: Date;
    
    @BeforeInsert()
    @BeforeUpdate()
    onInsertOrUpdate(): void {
        this.updatedAt = new Date();
    }
}