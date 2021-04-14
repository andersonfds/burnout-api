import { HttpException } from "@nestjs/common";

export class BusinessException extends HttpException {

    constructor(property: string, value: string) {
        const statusCode = 401;
        const errors = [{ property, value: [value] }];
        super({ statusCode, errors }, statusCode);
    }

}