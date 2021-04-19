import { Exclude } from "class-transformer";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, PrimaryGeneratedColumn } from "typeorm";

export class DefaultEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp', default: () => 'current_timestamp' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'current_timestamp' })
    updatedAt: Date;
    
    @BeforeInsert()
    @BeforeUpdate()
    onInsertOrUpdate(): void {
        this.updatedAt = new Date();
    }
}