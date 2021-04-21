import { HttpException, ValidationError } from "@nestjs/common";
import { ErrorResponseDto } from "../models/error-response-dto";

export class ValidationException extends HttpException {

    constructor(errors: ValidationError[]) {
        super(new ErrorResponseDto(errors), 400);
    }

}