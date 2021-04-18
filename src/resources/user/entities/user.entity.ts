import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from "class-transformer";
import { AfterLoad, BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 40 })
    firstName: string;

    @Column({ length: 40 })
    lastName: string;

    @Column({ length: 255 })
    email: string;

    @Exclude()
    @Column({ length: 500 })
    password: string;

    @Exclude()
    @Column({ type: 'timestamp', default: () => 'current_timestamp' })
    createdAt: Date;

    @Exclude()
    @Column({ type: 'timestamp', default: () => 'current_timestamp' })
    updatedAt: Date;

    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @Expose()
    get initials(): string {
        return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
    }

    @Exclude()
    private tempPassword: string;

    @AfterLoad()
    loadTempPassword(): void {
        this.tempPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        this.updatedAt = new Date();
        if (this.tempPassword != this.password)
            this.password = bcrypt.hashSync(this.password, 10);
    }

    validate(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }
}