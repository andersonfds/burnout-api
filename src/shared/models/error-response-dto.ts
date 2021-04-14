import { ApiProperty } from "@nestjs/swagger";
import { authMessages } from "@src/resources/auth/constants";
import { ValidationError } from "class-validator";

export class ErrorItemDto {
    @ApiProperty()
    property: string;

    @ApiProperty({ example: [authMessages.invalid_email] })
    value: string[];
}

export class ErrorResponseDto {
    constructor(errors: ValidationError[], statusCode = 500) {
        this.statusCode = statusCode;
        this.errors = errors.map(e =>
        ({
            property: e.property,
            value: Object.values(e.constraints),
        }));
    }

    @ApiProperty({ example: 400 })
    statusCode: number;

    @ApiProperty({ type: ErrorItemDto })
    errors: ErrorItemDto[];
}