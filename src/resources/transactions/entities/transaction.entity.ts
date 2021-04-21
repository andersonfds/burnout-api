import { UserEntity } from "@src/resources/user/entities/user.entity";
import { DefaultEntity } from "@src/shared/models/entity-base";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity('transaction')
export class TransactionEntity extends DefaultEntity {
    @Column('decimal')
    amount: number;
    
    @Column()
    success: boolean;

    @Column()
    description: string;

    @ManyToOne(() => UserEntity, user => user.transactions)
    user: UserEntity;
}