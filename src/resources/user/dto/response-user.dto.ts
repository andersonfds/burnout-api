import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ResponseUserDto {
    @Expose()
    @ApiProperty()
    id: string;
    
    @Expose()
    @ApiProperty()
    firstName: string;
    
    @Expose()
    @ApiProperty()
    lastName: string;
    
    @Expose()
    @ApiProperty()
    email: string;
    
    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @Expose()
    verified: boolean;

    @Expose()
    get initials(): string {
        return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
    }
}