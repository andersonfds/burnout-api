import { ActivityEntity } from '@src/resources/activity/entities/activity.entity';
import { TransactionEntity } from '@src/resources/transactions/entities/transaction.entity';
import { DefaultEntity } from '@src/shared/models/entity-base';
import * as bcrypt from 'bcrypt';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { UserRole } from '../enum/user-role.enum';

@Entity('user')
export class UserEntity extends DefaultEntity {

    @Column({ length: 40 })
    firstName: string;

    @Column({ length: 40 })
    lastName: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 500 })
    password: string;

    @Column('enum', { enum: UserRole })
    role: UserRole;

    @Column({ nullable: true, length: 255 })
    notificationId: string;

    @Column('decimal', { default: 0 })
    balance: number;

    @OneToMany(() => TransactionEntity, transaction => transaction.user)
    transactions: TransactionEntity;

    @ManyToMany(() => ActivityEntity, activity => activity.users)
    activities: ActivityEntity[];

    private tempPassword: string;

    @AfterLoad()
    loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        if (this.tempPassword != this.password)
            this.password = bcrypt.hashSync(this.password, 10);
    }

    validate(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}