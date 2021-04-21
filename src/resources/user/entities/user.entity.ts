import { DefaultEntity } from '@src/shared/models/entity-base';
import * as bcrypt from 'bcrypt';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
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